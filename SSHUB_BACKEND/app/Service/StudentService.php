<?php

namespace App\Service;

use App\Model\StudentModel;
use App\Repository\StudentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentService
{
    public function createStudent(Request $request)
    {
        $studentModel = new StudentModel();
        $studentRepository = new StudentRepository();

        $studentModel->first_name =  $request->first_name;
        $studentModel->last_name =  $request->last_name;
        $studentModel->gender =  $request->gender;
        $studentModel->dob =  $request->dob;
        $studentModel->soo =  $request->soo;
        $studentModel->address =  $request->address;
        $studentModel->class =  $request->class;
        $studentModel->parent_phone =  $request->parent_phone;

        if ($studentModel->first_name != '' && $studentModel->last_name != '' && $studentModel->gender != '' && $studentModel->dob != '' && $studentModel->soo != ''  && $studentModel->address != '' && $studentModel->class != '' && $studentModel->parent_phone != '') {
            return  $studentRepository->createStudent($studentModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }
}
