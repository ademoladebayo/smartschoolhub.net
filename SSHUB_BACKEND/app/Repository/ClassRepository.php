<?php

namespace App\Repository;

use App\Model\ClassModel;
use App\Service\AdminService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClassRepository
{
    public function createClass(ClassModel $ClassModel)
    {
        $AdminService = new AdminService();
        $ClassModel->save();
        $AdminService->updateTeacherClass($ClassModel->class_teacher, $ClassModel->id);
        return response()->json(['success' => true, 'message' => 'Class was created successfully.']);
    }

    public function editClass(Request $request)
    {
        $AdminService = new AdminService();

        $ClassModel = ClassModel::find($request->class_id);
        $ClassModel->class_name =  $request->class_name;
        $ClassModel->class_teacher =  $request->class_teacher;
        // REMOVE CLASS FROM PREVIOUS TEACHER
        $AdminService->removeClassFromTeacher($request->class_id);
        $ClassModel->save();
        // UPDATE THE TEACHER ASSIGNED CLASS
        Log::alert("ABOUT TO UPDATE ...");
        if ($request->class_teacher !="-") {
            $AdminService->updateTeacherClass($request->class_teacher, $request->class_id);
        }


        return response()->json(['success' => true, 'message' => 'Class updated successfully.']);
    }
    public function getAllClass()
    {
        $ClassModel =  new ClassModel();
        return  $ClassModel->with('class_teacher')->get();
    }

    public function deleteClass($class_id)
    {
        $class = ClassModel::find($class_id);
        $class->delete();
        return response()->json(['success' => true, 'message' => 'Class was deleted successfully.']);
    }

    public function searchClass($class_name)
    {
        //     ->orWhere('name', 'like', '%' . Input::get('name') . '%')->get();
        return  ClassModel::where('class_name', 'like', '%' . $class_name . '%')->with("class_teacher")->get();
    }
}
