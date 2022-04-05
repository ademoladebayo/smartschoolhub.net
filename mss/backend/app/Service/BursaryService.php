<?php

namespace App\Service;

use Illuminate\Http\Request;
use App\Model\BursaryModel;
use App\Model\FeeModel;
use App\Model\ExpenseModel;
use App\Model\PaymentHistoryModel;
use App\Repository\BursaryRepository;
use App\Repository\StudentRepository;
use App\Repository\TeacherRepository;
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
}
