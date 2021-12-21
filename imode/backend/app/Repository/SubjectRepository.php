<?php

namespace App\Repository;

use App\Model\SubjectModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubjectRepository
{

    public function createSubject(SubjectModel $SubjectModel)
    {
        $SubjectModel->save();
        return response()->json(['success' => true, 'message' => 'Subject was created successfully.']);
    }
    public function getAllSubject()
    {
        $SubjectModel =  new SubjectModel();
        return  $SubjectModel->with('teacher', 'class')->get();
    }

    public function editSubject(Request $request)
    {
        $SubjectModel = SubjectModel::find($request->subject_id);
        $SubjectModel->subject_name =  $request->subject_name;
        $SubjectModel->class =  $request->class_id;
        $SubjectModel->teacher =  $request->teacher;
        $SubjectModel->save();
        return response()->json(['success' => true, 'message' => 'Subject updated successfully.']);
    }

    public function deleteSubject($subject_id)
    {
        $SubjectModel = SubjectModel::find($subject_id);
        $SubjectModel->delete();
        return response()->json(['success' => true, 'message' => 'Subject was deleted successfully.']);
    }

    public function searchSubject($subject_name)
    {
        //     ->orWhere('name', 'like', '%' . Input::get('name') . '%')->get();
        return  SubjectModel::where('subject_name', 'like', '%' . $subject_name . '%')->with("teacher", "class")->get();
    }

    public function getNoOfAssignedSubject($teacher_id)
    {
        return DB::select('select count(teacher) as no_subject from subject where teacher =' . $teacher_id)[0]->no_subject;
    }
}
