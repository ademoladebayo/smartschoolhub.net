<?php

namespace App\Http\Controllers;

use App\Model\StudentModel;
use App\Model\PaymentHistoryModel;
use App\Model\FeeModel;
use App\Service\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{

    // SIGNIN
    public function signIn(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->signIn($request);
    }

    // SUBJECT
    public function registerSubject(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->registerSubject($request);
    }

    public function getRegisteredSubject(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->getRegisteredSubject($request);
    }

    public function getRegisteredSubjectID(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->getRegisteredSubjectID($request);
    }

    // CBT

    public function checkIfStudenHasTakenCBT($cbt_id, $student_id)
    {
        $StudentService = new StudentService();
        return $StudentService->checkIfStudenHasTakenCBT($cbt_id, $student_id);
    }

    public function submitCBT(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->submitCBT($request);
    }

    // PAYMENT
    public function allFee(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->allFee($request);
    }

    public function paymentHistory(Request $request)
    {
        return PaymentHistoryModel::where('student_id', $request->student_id)->orderBy('id', 'DESC')->get();
    }

    // RESULT
    public function getResult(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->getResult($request);
    }

    public function getCommentsAndPsycho(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->getCommentsAndPsycho($request);
    }


    // ATTENDANCE
    public function attendanceSummary(Request $request)
    {
        $StudentService = new StudentService();
        return $StudentService->attendanceSummary($request);
    }
}
