<?php

namespace App\Http\Controllers;

use App\Model\FeeModel;
use App\Model\ExpenseModel;
use App\Model\PaymentHistoryModel;
use Illuminate\Http\Request;
use App\Service\BursaryService;

class BursaryController extends Controller
{
    // SIGNIN
    public function signIn(Request $request)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->signIn($request);
    }


    // FEE MANAGEMENT
    public function createFee(Request $request)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->createFee($request);
    }

    public function editFee(Request $request)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->editFee($request);
    }

    public function allFee(Request $request)
    {
        return FeeModel::where('session', $request->session)->where('term', $request->term)->with('pay_by')->orderBy('id', 'DESC')->get();
    }
    public function deleteFee($fee_id)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->deleteFee($fee_id);
    }

    // EXPENSE MANAGEMENT
    public function createExpense(Request $request)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->createExpense($request);
    }

    public function editExpense(Request $request)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->editExpense($request);
    }

    public function allExpense(Request $request)
    {
        return ExpenseModel::where('session', $request->session)->where('term', $request->term)->orderBy('id', 'DESC')->get();
    }
    public function deleteExpense($fee_id)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->deleteExpense($fee_id);
    }


    // MANUAL PAYMENT MANAGEMENT
    public function createManualPayment(Request $request)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->createManualPayment($request);
    }

    public function editManualPayment(Request $request)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->editManualPayment($request);
    }

    public function allManualPayment(Request $request)
    {
        return PaymentHistoryModel::where('session', $request->session)->where('term', $request->term)->where('payment_type', 'CASH')->orwhere('payment_type', 'BANK')->with('class', 'student')->orderBy('id', 'DESC')->get();
    }
    public function deleteManualPayment($id)
    {
        $BursaryService = new BursaryService();
        return $BursaryService->deleteManualPayment($id);
    }

    // PAYMENT HISTORY 
    public function allPaymentHistory(Request $request)
    {
        return PaymentHistoryModel::where('session', $request->session)->where('term', $request->term)->with('class', 'student')->orderBy('id', 'DESC')->get();
    }

    public function searchPayment(Request $request)
    {
        return  PaymentHistoryModel::where('date', 'like', '%' . $request->search_data . '%')->orWhere('payment_type', 'like', '%' . $request->search_data . '%')->orWhere('amount', 'like', '%' . $request->search_data . '%')->where('session', $request->session)->where('term', $request->term)->with('class', 'student')->orderBy('id', 'DESC')->get();
    }
}
