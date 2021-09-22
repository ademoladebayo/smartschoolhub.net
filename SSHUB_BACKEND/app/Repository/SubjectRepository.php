<?php

namespace App\Repository;

use App\Model\SubjectModel;
use Illuminate\Http\Request;
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
        return  $SubjectModel->with('teacher','class')->get();
    }
}
