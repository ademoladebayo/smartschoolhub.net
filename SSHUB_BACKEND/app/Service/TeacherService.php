<?php

namespace App\Service;

use App\Model\TeacherModel;
use App\Repository\TeacherRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TeacherService
{
    public function createTeacher(Request $request)
    {
        $TeacherModel = new TeacherModel();
        $TeacherRepository = new TeacherRepository();

        $TeacherModel->first_name =  $request->first_name;
        $TeacherModel->last_name =  $request->last_name;
        $TeacherModel->gender =  $request->gender;
        $TeacherModel->address =  $request->address;
        $TeacherModel->phone =  $request->phone;
        $TeacherModel->email =  $request->email;

        if ($TeacherModel->first_name != '' && $TeacherModel->last_name != '' && $TeacherModel->gender != '' && $TeacherModel->address != '' && $TeacherModel->phone != '' && $TeacherModel->email != '') {
            return  $TeacherRepository->createTeacher($TeacherModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }

    public function getAllTeacher()
    {
        $TeacherRepository = new TeacherRepository();
        return $TeacherRepository->getAllTeacher();
    }
}
