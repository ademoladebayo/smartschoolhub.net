<?php

namespace App\Http\Controllers;

use App\Model\StudentModel;
use App\Service\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    public function createStudent(Request $request)
    {
        $studentService = new StudentService();
        return $studentService->createStudent($request);
    }
    
}
