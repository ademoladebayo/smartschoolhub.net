<?php

namespace App\Http\Controllers;

use App\Model\TeacherModel;
use App\Repository\StudentAttendanceRepository;
use App\Service\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    // SIGNIN
    public function signIn(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->signIn($request);
    }

    // SUBJECT
    public function registerSubject(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->registerSubject($request);
    }

    public function getRegisteredSubject(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->getRegisteredSubject($request);
    }

    public function getAssignedSubject(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->getAssignedSubject($request);
    }

    // CBT

    public function createCBT(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->createCBT($request);
    }

    public function editCBT(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->editCBT($request);
    }

    public function allCBT(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->allCBT($request);
    }

    public function deleteCBT($cbt_id)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->deleteCBT($cbt_id);
    }

    public function getCBTResult($cbt_id)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->getCBTResult($cbt_id);
    }

    // RESULT UPLOAD
    public function getStudentRegistered(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->getStudentRegistered($request);
    }

    public function uploadResult(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->uploadResult($request);
    }


    // ATTENDANCE
    public function takeAttendance(Request $request)
    {
        $StudentAttendanceRepository = new StudentAttendanceRepository();
        return $StudentAttendanceRepository->takeAttendance($request);
    }

    public function getAttendance(Request $request)
    {
        $StudentAttendanceRepository = new StudentAttendanceRepository();
        return $StudentAttendanceRepository->getAttendance($request);
    }
}
