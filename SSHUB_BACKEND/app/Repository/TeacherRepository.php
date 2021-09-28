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
        return  $TeacherModel->with('assigned_class')->get();
    }
    public function updateTeacherClass($teacher_id, $class_id)
    {
        $TeacherModel = TeacherModel::find($teacher_id);
        $TeacherModel->assigned_class = $class_id;
        $TeacherModel->save();
    }
    public function removeClassFromTeacher($class_id)
    {
        $TeacherModel =  TeacherModel::where('assigned_class', $class_id)->first();
        $TeacherModel->assigned_class = "";
        $TeacherModel->save();
    }
}
