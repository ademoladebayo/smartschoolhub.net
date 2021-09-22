<?php

namespace App\Repository;

use App\Model\TeacherModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TeacherRepository
{

    public function createTeacher(TeacherModel $TeacherModel)
    {
        $TeacherModel->save();
        return response()->json(['success' => true, 'message' => 'Teacher was created successfully.']);
    }
    public function getAllTeacher()
    {
        $TeacherModel =  new TeacherModel();
        return  $TeacherModel->with('class')->get();
    }
}
