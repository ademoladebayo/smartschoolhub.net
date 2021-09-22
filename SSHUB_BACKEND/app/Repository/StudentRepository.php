<?php

namespace App\Repository;

use App\Model\StudentModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentRepository
{

    public function createStudent(StudentModel $studentModel)
    {
        $studentModel->save();
        return response()->json(['success' => true, 'message' => 'Student was created successfully.']);
    }
    public function getAllstudent()
    {
        $studentModel =  new StudentModel();
        return  $studentModel->with('address')->get();
    }
}
