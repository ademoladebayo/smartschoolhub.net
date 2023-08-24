<?php

namespace App\Service;

use Illuminate\Http\Request;
use App\Model\BursaryModel;
use App\Model\ClassModel;
use App\Model\DebitorModel;
use App\Model\FeeModel;
use App\Model\ExpenseModel;
use App\Model\PaymentHistoryModel;
use App\Model\OptionalFeeRequestModel;
use App\Model\PortalSubscription;
use App\Model\SessionModel;
use App\Model\StudentModel;
use App\Model\ControlPanelModel;
use App\Repository\BursaryRepository;
use App\Repository\StudentRepository;
use App\Repository\TeacherRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BursaryService
{
    // SIGNIN
    public function signIn(Request $request)
    {
        $BursaryRepository = new BursaryRepository();
        $bursary = BursaryModel::where('username', $request->id)->get()->first();
        if ($bursary == null) {
            return  response(['success' => false, 'message' => "Invalid Admin!"]);
        } else {

            if ($BursaryRepository->getPassword($request->id) == $request->password) {
                $token = $bursary->createToken('token')->plainTextToken;
                return  response(['token' => $token, 'success' => true, 'message' => 'Welcome, Bursary', 'data' => $bursary, 'dashboard_information' => ""]);
            } else {
                return  response(['success' => false, 'message' => "Invalid Password"]);
            }
        }
    }


    // GET DASHBOARD DETAILS
    public function getDashboardInfo(Request $request)
    {
        $StudentRepository = new StudentRepository();
        $TeacherRepository = new TeacherRepository();

        $total_manual_payment = 0;
        $total_bank = 0;
        $total_cash = 0;
        $total_expense = 0;
        $total_arrears = 0;
        $total_debt = 0;

        $payment_history = PaymentHistoryModel::select('amount')->where('session', $request->session)->where('term', $request->term)->get();
        $expenses = ExpenseModel::select('amount')->where('session', $request->session)->where('term', $request->term)->get();
        $descriptions =  PaymentHistoryModel::select('payment_description')->where('session', $request->session)->where('term', $request->term)->get();
        $total_debt =  intval(DebitorModel::sum('amount'));


        foreach ($descriptions as $description) {
            if (strpos($description->payment_description, "WAS USED TO SETTLE THE ARREARS") !== false) {
                // FULL SETTLEMENT
                $total_arrears = $total_arrears + intval(str_replace(str_split('₦,()'), '', explode("WAS", explode("BUT", $description->payment_description)[1])[0]));
            } elseif (strpos($description->payment_description, "WAS USED TO SETTLE PART OF THE ARREARS") !== false) {
                // PART SETTLEMENT
                $total_arrears = $total_arrears + intval(str_replace(str_split('₦,()'), '', explode("PAID", explode("AND", $description->payment_description)[0])[1]));
            }
        }


        // GET TOTAL MANUAL PAYMENT
        foreach ($payment_history as $payment) {
            $total_manual_payment = $total_manual_payment + intval($payment->amount);
        }

        // GET TOTAL EXPENSES
        foreach ($expenses as $expense) {
            $total_expense = $total_expense + intval($expense->amount);
        }



        // CHART DATA
        // EXPECTED FEE , TOTAL COLLECTED , SESSION/TERM
        $active_students = StudentModel::where('profile_status', 'ENABLED')->where('class','!=','GRADUATED')->get();
        $session = $request->session;
        $terms = ['FIRST TERM', 'SECOND TERM', 'THIRD TERM'];

        $expected_fee = [];
        $collected_fee = [];
        $expenses_fee = [];


        $bursaryService = new BursaryService();

        $tc = 0;
        foreach ($terms as $term) {
            $expected = 0;
            $collected = 0;
            $exp = 0;


            foreach ($active_students as $student) {
                // GET EXPECTED
                $expect_fee = $bursaryService->getPayableForClass($student->class, $session, $term);
                $optional_fee = $bursaryService->getOptionalFeeRequest($student->id, $session, $term);
                $expected += ($expect_fee + $optional_fee);

                // GET COLLECTED
                // $collected +=  $bursaryService->getTotalPaid($student->id, $session, $term);    ONLY ACTIVE STUDENT
            }

            $payment_history = PaymentHistoryModel::select('amount')->where('session', $session)->where('term', $term)->get();
            foreach ($payment_history as $payment) {
                $collected += intval($payment->amount);
            }


            $expenses = ExpenseModel::select('amount')->where('session', $session)->where('term', $term)->get();
            foreach ($expenses as $expense) {
                $exp += intval($expense->amount);
            }

            $expected_fee[$tc] = $expected;
            $collected_fee[$tc] = $collected;
            $expenses_fee[$tc] = $exp;
            $tc += 1;
        }

        $expected = ['first_term' => $expected_fee[0], 'second_term' => $expected_fee[1], 'third_term' => $expected_fee[2]];
        $collected = ['first_term' => $collected_fee[0], 'second_term' => $collected_fee[1], 'third_term' => $collected_fee[2]];
        $expenses = ['first_term' => $expenses_fee[0], 'second_term' => $expenses_fee[1], 'third_term' => $expenses_fee[2]];



        sort($expenses_fee);
        $expense_min =  0;
        foreach ($expenses_fee as $ef) {
            if ($ef != 0) {
                $expense_min = $ef;
                break;
            }
        }

        $fee_min = 0;
        $fee_arr = array_merge($expected_fee, $collected_fee);
        sort($fee_arr);
        foreach ($fee_arr as $fa) {
            if ($fa != 0) {
                $fee_min = $fa;
                break;
            }
        }

        $chart_data = ['fee' => ['expected' => $expected, 'collected' => $collected], 'expenses' => $expenses, 'fee_min' => $fee_min, 'expense_min' => $expense_min];

        return response()->json(['student_no' => $StudentRepository->allStudentCount(), 'teacher_no' => $TeacherRepository->allTeacherCount(), 'total_manual_payment' => $total_manual_payment, 'total_arrears' => $total_arrears, 'total_bank' => $total_bank, 'total_cash' => $total_cash, 'total_expense' =>  $total_expense,  'total_debt' => $total_debt, 'chart_data' => $chart_data]);
    }

    // FEE MANAGEMENT
    public function createFee(Request $request)
    {
        $FeeModel = new FeeModel();
        $FeeModel->description = $request->description;
        $FeeModel->type = $request->fee_type;
        $FeeModel->class = $request->class;
        $FeeModel->amount = $request->amount;

        $FeeModel->session = $request->session;
        $FeeModel->term = $request->term;
        $FeeModel->save();
        return response(['success' => true, 'message' => "Fee was created successfully."]);
    }

    public function editFee(Request $request)
    {
        $FeeModel = FeeModel::find($request->fee_id);
        $FeeModel->description = $request->description;
        $FeeModel->type = $request->fee_type;
        $FeeModel->class = $request->class;
        $FeeModel->amount = $request->amount;
        $FeeModel->save();
        return response(['success' => true, 'message' => "Fee was updated successfully."]);
    }

    public function DeleteFee($fee_id)
    {
        FeeModel::destroy($fee_id);
        return response(['success' => true, 'message' => "Fee was deleted successfully."]);
    }

    public function getAllOptionalFeeRequest(Request $request)
    {
        $fee_request =  OptionalFeeRequestModel::where("session", $request->session)->where("term", $request->term)->with("student", "fee")->orderBy('id','DESC')->get();

        foreach ($fee_request as $request) {
            $request->class_name = ClassModel::find(StudentModel::find($request->student_id)->class)->class_name;
        }

        return  $fee_request;
    }

    public function updateOptionalFeeRequest(Request $request)
    {
        $optionalFeeRequest = OptionalFeeRequestModel::find($request->id);
        $optionalFeeRequest->approved =  $request->status;
        $optionalFeeRequest->save();
        return response(['success' => true, 'message' => "Action was successful."]);
    }


    // EXPENSE MANAGEMENT
    public function createExpense(Request $request)
    {
        $ExpenseModel = new ExpenseModel();
        $ExpenseModel->description = $request->description;
        $ExpenseModel->date_incurred = $request->date_incurred;
        $ExpenseModel->last_modified = $request->last_modified;
        $ExpenseModel->amount = $request->amount;

        $ExpenseModel->session = $request->session;
        $ExpenseModel->term = $request->term;
        $ExpenseModel->save();
        return response(['success' => true, 'message' => "Expense was created successfully."]);
    }

    public function editExpense(Request $request)
    {
        $ExpenseModel = ExpenseModel::find($request->expense_id);
        $ExpenseModel->description = $request->description;
        $ExpenseModel->date_incurred = $request->date_incurred;
        $ExpenseModel->last_modified = $request->last_modified;
        $ExpenseModel->amount = $request->amount;
        $ExpenseModel->save();
        return response(['success' => true, 'message' => "Expense was updated successfully."]);
    }

    public function DeleteExpense($expense_id)
    {
        ExpenseModel::destroy($expense_id);
        return response(['success' => true, 'message' => "Expense was deleted successfully."]);
    }

    // MANUAL PAYMENT MANAGEMENT
    public function createManualPayment(Request $request)
    {
        //   BEFORE PERSISTING, REDUCE PAYMENT FROM ARREARS IF THERE IS ANY.
        // GET STUDENT ARREARS
        $arrears = DebitorModel::select("amount")->where("student_id", $request->student)->get();

        if (count($arrears) > 0) {
            $arrears = $arrears[0]->amount;
        } else {
            $arrears = 0;
        }

        if ($arrears > 0) {
            // STUDENT HAS AN ARREARS, REMOVE ARREARS FROM PAYING AMOUNT
            $balance_after_removing_arrears = intval($request->amount) - $arrears;

            if ($balance_after_removing_arrears > 0) {
                // MEANS ARREARS HAS BEEN CLEARED, UPDATE STUDENT ARREARS TO NGN 0.0
                DB::table('debitors')
                    ->where('student_id', $request->student)
                    ->update(['amount' => 0]);

                //USE balance_after_removing_arrears TO PAY FOR TERM PART PAYMENT
                $PaymentHistoryModel = new PaymentHistoryModel();
                $PaymentHistoryModel->student_id = $request->student;
                $PaymentHistoryModel->class_id = $request->student_class;
                $PaymentHistoryModel->date = $request->date;
                $PaymentHistoryModel->payment_type = $request->payment_type;
                $PaymentHistoryModel->fee_type = $request->fee_type;
                $PaymentHistoryModel->payment_description = "PAID (₦" . number_format($request->amount) . ") BUT (₦" . number_format($arrears) . "), WAS USED TO SETTLE THE ARREARS AND THE REMAINING (₦" . number_format($balance_after_removing_arrears) . ") WAS PAID FOR THIS TERM.";
                $PaymentHistoryModel->amount = $balance_after_removing_arrears;

                $PaymentHistoryModel->session = $request->session;
                $PaymentHistoryModel->term = $request->term;
                $PaymentHistoryModel->save();
            } else {
                // STUDENT STILL OWES balance_after_removing_arrears , UPDATE STUDENT ARREARS AS AREARS + balance_after_removing_arrear
                DB::table('debitors')
                    ->where('student_id', $request->student)
                    ->update(['amount' => abs($balance_after_removing_arrears)]);

                $PaymentHistoryModel = new PaymentHistoryModel();
                $PaymentHistoryModel->student_id = $request->student;
                $PaymentHistoryModel->class_id = $request->student_class;
                $PaymentHistoryModel->date = $request->date;
                $PaymentHistoryModel->payment_type = $request->payment_type;
                $PaymentHistoryModel->fee_type = "COMPULSORY";
                $PaymentHistoryModel->payment_description = "PAID (₦" . number_format($request->amount) . ") AND IT WAS USED TO SETTLE PART OF THE ARREARS OF (₦" . number_format($arrears) . "), YOU STILL HAVE AN ARREARS OF (₦" . number_format(abs($balance_after_removing_arrears)) . ").";
                $PaymentHistoryModel->amount = 0;

                $PaymentHistoryModel->session = $request->session;
                $PaymentHistoryModel->term = $request->term;
                $PaymentHistoryModel->save();
            }
        } else {
            // STUDENT DOES NOT HAVE ANY ARREARS
            $PaymentHistoryModel = new PaymentHistoryModel();
            $PaymentHistoryModel->student_id = $request->student;
            $PaymentHistoryModel->class_id = $request->student_class;
            $PaymentHistoryModel->date = $request->date;
            $PaymentHistoryModel->payment_type = $request->payment_type;
            $PaymentHistoryModel->fee_type = $request->fee_type;
            $PaymentHistoryModel->payment_description = $request->payment_description;
            $PaymentHistoryModel->amount = $request->amount;

            $PaymentHistoryModel->session = $request->session;
            $PaymentHistoryModel->term = $request->term;
            $PaymentHistoryModel->save();
        }



        return response(['success' => true, 'message' => "Manual Payment was created successfully."]);
    }

    public function editManualPayment(Request $request)
    {
        $PaymentHistoryModel = PaymentHistoryModel::find($request->manual_payment_id);
        $PaymentHistoryModel->student_id = $request->student;
        $PaymentHistoryModel->class_id = $request->student_class;
        $PaymentHistoryModel->date = $request->date;
        $PaymentHistoryModel->payment_type = $request->payment_type;
        $PaymentHistoryModel->fee_type = $request->fee_type;
        $PaymentHistoryModel->payment_description = $request->payment_description;
        $PaymentHistoryModel->amount = $request->amount;
        $PaymentHistoryModel->save();
        return response(['success' => true, 'message' => "Manual Payment was updated successfully."]);
    }

    public function DeleteManualPayment($id)
    {
        PaymentHistoryModel::destroy($id);
        return response(['success' => true, 'message' => "Manual Payment was deleted successfully."]);
    }

    // DEBITOR MANAGEMENT
    public function syncLastestDebitor(Request $request)
    {
        $ControlPanelModel =  ControlPanelModel::find(1);
        // CHECK IF ACTION IS PERMITTED
        if (explode("-", $ControlPanelModel->debitor_list_last_update)[1] == "NO") {
            return response(['success' => false, 'message' => "This action is locked, Contact your admin."]);
        }

        //LOOP THROUGH ALL STUDENT
        $all_student = StudentModel::select("id", "class")->where("profile_status", "ENABLED")->get();
        $c = 0;
        foreach ($all_student as $student) {
            $total_payable =  $this->getPayableForClass($student->class, $request->session, $request->term);
            $optional_fee = $this->getOptionalFeeRequest($student->id, $request->session, $request->term);
            $total_paid =  $this->getTotalPaid($student->id, $request->session, $request->term);
            $balance = ($total_payable + $optional_fee) - $total_paid;

            if ($balance > 0) {
                // ADD STUDENT TO DEBITOR TABLE
                // IF STUDENT ALREADY EXISTING ON DEBITORS LIST UPDATE AMOUNT ELSE RUN NEW INSERT
                $debitorModel = DebitorModel::where("student_id", $student->id)->get()->first();
                if ($debitorModel != null) {
                    $debitorModel->amount = intval($debitorModel->amount) + intval($balance);
                    $debitorModel->last_checked = $request->session . " " . $request->term . "_" . date("l jS \of F Y h:i:s A");
                    $debitorModel->save();
                } else {
                    $debitorModel = new DebitorModel();
                    $debitorModel->student_id = $student->id;
                    $debitorModel->amount = $balance;
                    $debitorModel->last_checked = $request->session . " " . $request->term . "_" . date("l jS \of F Y h:i:s A");
                    $debitorModel->save();
                }
            }

            // SCHOOL OWES STUDENT
            if ($balance < 0) {
                // TO BE IMPLEMENTED IN THE FUTURE
            }


            $c = $c + 1;
        }

        // UPDATE DEBITOR LIST LAST UPDATE
        $ControlPanelModel->debitor_list_last_update = $request->session . " " . $request->term . "_" . date("l jS \of F Y h:i:s A") . "-NO";
        $ControlPanelModel->save();

        return response(['success' => true, 'message' => "{" . $c . "} Sync was successful."]);
    }


    public function getPayableForClass(String $class_id, String $session, String  $term)
    {
        $class_sector = ClassModel::select('class_sector')->where('id', $class_id)->get()[0]->class_sector;
        $fees =  FeeModel::orWhere('class', $class_id)->where("type", "COMPULSORY")->where('session', $session)->where('term', $term)
            ->orWhere('class', $class_sector)->where("type", "COMPULSORY")->where('session', $session)->where('term', $term)
            ->orWhere('class', 'ALL STUDENT')->where("type", "COMPULSORY")->where('session', $session)->where('term', $term)->get();
        $expected_amount = 0;
        foreach ($fees as $fee) {
            $expected_amount = $expected_amount + intval($fee->amount);
        }
        return $expected_amount;
    }


    public function getOptionalFeeRequest(String $student_id, String $session, String  $term)
    {
        $optional_fee = 0;
        $OptionalFeeRequest = OptionalFeeRequestModel::select('fee_id')->where('student_id', $student_id)->where('session', $session)->where('term', $term)->get();


        if ($OptionalFeeRequest == null) {
            return $optional_fee;
        } else {
            foreach ($OptionalFeeRequest as $optionalfee) {
                // USE COORESPONDING FEE_ID TO GET THE ACTUAL AMOUNT IN FEE TABLE
                $request_amount = FeeModel::select("amount")->where("id", $optionalfee->fee_id)->get()[0]->amount;
                $optional_fee += $request_amount;
            }
        }
        return $optional_fee;
    }


    public function getOptionalFeeId(String $student_id, String $session, String  $term)
    {
        $optional_fee = [];
        $OptionalFeeRequest = OptionalFeeRequestModel::select('fee_id')->where('student_id', $student_id)->where('session', $session)->where('term', $term)->get();


        if ($OptionalFeeRequest == null) {
            return $optional_fee;
        } else {
            foreach ($OptionalFeeRequest as $optionalfee) {
                array_push($optional_fee, $optionalfee->fee_id);
            }
        }
        return $optional_fee;
    }

    public function getApprovedOptionalFeeId(String $student_id, String $session, String  $term)
    {
        $optional_fee = [];
        $OptionalFeeRequest = OptionalFeeRequestModel::select('fee_id')->where('student_id', $student_id)->where('session', $session)->where('term', $term)->where('approved', 1)->get();


        if ($OptionalFeeRequest == null) {
            return $optional_fee;
        } else {
            foreach ($OptionalFeeRequest as $optionalfee) {
                array_push($optional_fee, $optionalfee->fee_id);
            }
        }
        return $optional_fee;
    }

    public function getTotalPaid(String $student_id, String $session, String  $term)
    {
        $payment_history = PaymentHistoryModel::select('amount')->where('student_id', $student_id)->where('session', $session)->where('term', $term)->get();
        $total_paid = 0;
        foreach ($payment_history as $payment) {
            $total_paid = $total_paid + intval($payment->amount);
        }
        return $total_paid;
    }

    // DEBITORS LIST
    public function allDebitor(Request $request)
    {
        $ControlPanelModel =  ControlPanelModel::find(1);
        $last_checked = explode("-", $ControlPanelModel->debitor_list_last_update)[0];

        //LOOP THROUGH ALL STUDENT
        $all_student = StudentModel::select("id", "class", "first_name", "last_name", "student_id", "graduation", "profile_status")->orderBy('id', 'DESC')->get();

        // $all_student = StudentModel::select("id", "class", "first_name", "last_name", "student_id", "graduation", "profile_status")->orderBy('id', 'DESC')->with("class")->get();

        //$all_student = StudentModel::select("id", "class", "first_name", "last_name", "student_id")->whereNotIn('class', ['GRADUATED'])->with("class")->get();
        $c = 0;
        foreach ($all_student as $student) {
            $expected_fee = 0;
            $optional_fee = 0;
            $total_paid = 0;
            $arrears = 0;
            $total_balance = 0;

            if ($student->class == "GRADUATED" || $student->profile_status == "DISABLED") {
                Log::alert("IF : " . $student->first_name);
                if ($student->class == "GRADUATED") {
                    Log::alert("GRADUATION : " . $student->graduation);
                    $class_before_graduation =  explode("_", $student->graduation)[0];
                    $session_before_graduation = explode("_", $student->graduation)[1];
                    $term_before_graduation = explode("_", $student->graduation)[2];
                    $student->graduation_details = "GRADUATED (" . $session_before_graduation . "-" . $term_before_graduation . ")";
                    $student["class"] = $student->graduation_details;
                }else{
                    $student["class"] = ClassModel::find($student->class);
                }

                // SO FOR EACH GRADUATED STUDENT GET THEIR LAST CLASS_SESSION_TERM
                // $expected_fee = $this->getPayableForClass($class_before_graduation, $session_before_graduation, $term_before_graduation);
                // $optional_fee = $this->getOptionalFeeRequest($student->id, $session_before_graduation, $term_before_graduation);
                // $total_paid =  $this->getTotalPaid($student->id, $session_before_graduation, $term_before_graduation);
                $total_paid =  $this->getTotalPaid($student->id, $request->session, $request->term);
                $arrears = DebitorModel::select("amount", "last_checked")->where("student_id", $student->id)->get();
            } else {
                // SO FOR EACH STUDENT, GET EXPECTED FEE FOR THE TERM + THEIR REQUESTED OPTIONAL, TOTAL PAID , ARREARS AND TOTAL BALANCE
                Log::alert("ELSE : " . $student->first_name);

                $paymentHistory = PaymentHistoryModel::select('class_id')->where('student_id', $student->id)->where('session', $request->session)->where('term', $request->term)->get();
                $class = "";
                if (count($paymentHistory) != 0) {
                    // USE CLASS STUDENT WAS IN
                    $class = $paymentHistory[0]->class_id;
                } else {
                    // USE THE CURRENT CLASS
                    $class = $student->class;
                }

                $student["class"] = ClassModel::find($class);


                $expected_fee = $this->getPayableForClass($class, $request->session, $request->term);
                $optional_fee = $this->getOptionalFeeRequest($student->id, $request->session, $request->term);
                $total_paid =  $this->getTotalPaid($student->id, $request->session, $request->term);
                $arrears = DebitorModel::select("amount", "last_checked")->where("student_id", $student->id)->get();
            }

            Log::alert("ARREARS : " . $arrears);

            if (count($arrears) > 0) {
                $arrears = $arrears[0]->amount;
            } else {
                $arrears = 0;
            }



            $student["expected_fee"] = $expected_fee + $optional_fee;
            $student["total_paid"] = $total_paid;
            $student["balance"] = ($expected_fee + $optional_fee) - $total_paid;
            $student["arrears"] = $arrears;
            $student["total_balance"] = intval($arrears) + intval($student["balance"]);
            $c = $c + 1;
        }

        return response(['content' => $all_student, 'last_checked' => $last_checked]);
    }

    function getStudentPercentagePaid(Request $request)
    {
        $bursaryService = new BursaryService();
        $class = StudentModel::select('class')->where('id', $request->student_id)->get()[0]->class;

        $expected_fee = 0;
        $optional_fee = 0;
        $total_paid = 0;

        // SO GET STUDENT'S, GET EXPECTED FEE FOR THE TERM + THEIR REQUESTED OPTIONAL, TOTAL PAID , ARREARS AND TOTAL BALANCE
        $expected_fee = $bursaryService->getPayableForClass($class, $request->session, $request->term);
        $optional_fee = $bursaryService->getOptionalFeeRequest($request->student_id, $request->session, $request->term);
        $total_paid =  $bursaryService->getTotalPaid($request->student_id, $request->session, $request->term);


        $percentage_paid = ($total_paid / ($expected_fee + $optional_fee)) * 100;
        return $percentage_paid;
    }


    function getPortalSubscription()
    {
        $PortalSubscriptionModel = PortalSubscription::orderBy('id', 'DESC')->get();

        // GET CURRENT SESSION
        $session_term = SessionModel::where("session_status", "CURRENT")->get()[0];
        $session = str_replace("/", "", $session_term->session);
        $term = str_replace(" ", "", $session_term->term);

        foreach ($PortalSubscriptionModel as $portalSubscription) {

            if ($portalSubscription->subscription_id == $session . "" . $term) {
                $portalSubscription->status = "USAGE IN-PROGRESS";
                $portalSubscription->description = "CALCULATION WILL BE DONE AT THE END OF THE TERM";
                $portalSubscription->amount = "0";
            }
        }

        return  $PortalSubscriptionModel;
    }

    function editPortalSubscription(Request $request)
    {
        $PortalSubscriptionModel = PortalSubscription::find($request->id);
        $PortalSubscriptionModel->status = "PAID";
        $PortalSubscriptionModel->subscription_id = $request->subscription_id;
        $PortalSubscriptionModel->description = $request->description;
        $PortalSubscriptionModel->amount = $request->amount;
        $PortalSubscriptionModel->save();
        return response(['success' => true, 'message' => "Payment has successfully been recorded."]);
    }
}
