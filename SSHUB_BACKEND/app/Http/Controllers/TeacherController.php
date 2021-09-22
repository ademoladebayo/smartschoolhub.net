<?php

namespace App\Http\Controllers;

use App\Model\TeacherModel;
use App\Service\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    public function createTeacher(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->createTeacher($request);
    }

    public function getAllTeacher()
    {
        $TeacherService = new TeacherService();
        return $TeacherService->getAllTeacher();
    }
}
