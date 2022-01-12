<?php

namespace App\Repository;

use App\Model\TeacherModel;
use App\Model\UserProfileModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\hash;

class TeacherRepository
{

    public function createTeacher(TeacherModel $TeacherModel)
    {

        $TeacherModel->profile_status = 'ENABLED';
        $TeacherModel->password = hash::make(strtolower($TeacherModel->first_name + "." + $TeacherModel->last_name));
        $TeacherModel->save();

        // CREATE TEACHER ID
        if (strlen($TeacherModel->id) == 1) {
            $TeacherModel->teacher_id = date("Y") . "-STF-00" . $TeacherModel->id;
        } elseif (strlen($TeacherModel->id) == 2) {
            $TeacherModel->teacher_id = date("Y") . "-STF-0" . $TeacherModel->id;
        } else {
            $TeacherModel->teacher_id = date("Y") . "-STF-" . $TeacherModel->id;
        }
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
        if ($TeacherModel != "") {
            log::debug($TeacherModel);
            $TeacherModel->assigned_class = "-";
            $TeacherModel->save();
        }
    }

    public function editTeacher(Request $request)
    {
        $TeacherModel = TeacherModel::find($request->teacher_id);
        $TeacherModel->title =  $request->title;
        $TeacherModel->first_name =  $request->first_name;
        $TeacherModel->last_name =  $request->last_name;
        $TeacherModel->middle_name = $request->middle_name == "" ? "" : $request->middle_name;
        $TeacherModel->gender =  $request->gender;
        $TeacherModel->phone =  $request->teacher_phone;
        $TeacherModel->email =  $request->teacher_email == "" ? "" : $request->teacher_email;
        $TeacherModel->dob =  $request->dob;
        $TeacherModel->religion =  $request->religion;
        $TeacherModel->joining_date =  $request->joining_date == "" ? "" : $request->joining_date;
        $TeacherModel->home_address =  $request->home_address;
        $TeacherModel->state =  $request->state;

        $TeacherModel->save();

        return response()->json(['success' => true, 'message' => 'Teacher was updated successfully.']);
    }

    public function deleteTeacher($teacher_id)
    {
        TeacherModel::find($teacher_id)->delete();
        return response()->json(['success' => true, 'message' => 'Teacher was deleted successfully.']);
    }

    public function searchTeacher($search_data)
    {
        return  TeacherModel::where('teacher_id', 'like', '%' . $search_data . '%')->orWhere('first_name', 'like', '%' . $search_data . '%')->orWhere('last_name', 'like', '%' . $search_data . '%')->with("assigned_class")->get();
    }

    public function updateTeacherProfileStatus($id)
    {
        $TeacherModel =  TeacherModel::find($id);
        $TeacherModel->profile_status =  $TeacherModel->profile_status == 'ENABLED' ? 'DISABLE' : 'ENABLED';
        $TeacherModel->save();
        return response()->json(['success' => true, 'message' => 'Profile updated successfully.']);
    }

    public function getPassword($id)
    {
        return DB::select("select password from teacher where teacher_id ='" . $id . "'")[0]->password;
    }

    public function updatePassword($teacher_id, $password)
    {
        DB::table('teacher')
                ->where('teacher_id', $teacher_id)
                ->update(['password' => $password]);
    }
}
