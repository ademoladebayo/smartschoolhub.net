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
use App\Model\StudentModel;
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

        $payment_history = PaymentHistoryModel::select('amount')->where('session', $request->session)->where('term', $request->term)->get();
        $expenses = ExpenseModel::select('amount')->where('session', $request->session)->where('term', $request->term)->get();



        // GET TOTAL MANUAL PAYMENT
        foreach ($payment_history as $payment) {
            $total_manual_payment = $total_manual_payment + intval($payment->amount);
        }

        // GET TOTAL EXPENSES
        foreach ($expenses as $expense) {
            $total_expense = $total_expense + intval($expense->amount);
        }

        return response()->json(['student_no' => $StudentRepository->allStudentCount(), 'teacher_no' => $TeacherRepository->allTeacherCount(), 'total_manual_payment' => $total_manual_payment, 'total_bank' => $total_bank, 'total_cash' => $total_cash, 'total_expense' =>  $total_expense]);
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

        //LOOP THROUGH ALL STUDENT 
        $all_student = StudentModel::select("id", "class")->get();
        $c = 0;
        foreach ($all_student as $student) {

            $total_payable =  $this->getPayableForClass($student->class, $request->session, $request->term);
            $total_paid =  $this->getTotalPaid($student->id, $request->session, $request->term);
            $balance = $total_payable - $total_paid;

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
            $c = $c + 1;
        }
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
        $expected_fee = 0;
        $optional_fee = 0;
        $total_paid = 0;
        $arrears = 0;
        $total_balance = 0;

        //LOOP THROUGH ALL STUDENT 
        $all_student = StudentModel::select("id", "class", "first_name", "last_name", "student_id")->with("class")->get();
        $c = 0;
        foreach ($all_student as $student) {
            // SO FOR EACH STUDENT, GET EXPECTED FEE FOR THE TERM + THEIR REQUESTED OPTIONAL, TOTAL PAID , ARREARS AND TOTAL BALANCE
            $expected_fee = $this->getPayableForClass($student->class, $request->session, $request->term);
            $optional_fee = $this->getOptionalFeeRequest($student->id, $request->session, $request->term);
            $total_paid =  $this->getTotalPaid($student->id, $request->session, $request->term);
            $arrears = DebitorModel::select("amount", "last_checked")->where("student_id", $student->id)->get();
            Log::alert("ARREARS : " . $arrears);

            if (count($arrears) > 0) {
                $student["last_checked"] = $arrears[0]->last_checked;
                $arrears = $arrears[0]->amount;
            } else {
                $arrears = 0;
            }




            $student["expected_fee"] = $expected_fee + $optional_fee;
            $student["total_paid"] = $total_paid;
            $student["balance"] = $expected_fee - $total_paid;
            $student["arrears"] = $arrears;
            $student["total_balance"] = intval($arrears) + intval($student["balance"]);

            $c = $c + 1;
        }


        return $all_student;
    }
}
