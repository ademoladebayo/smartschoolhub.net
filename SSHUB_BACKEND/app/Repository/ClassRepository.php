<?php

namespace App\Repository;

use App\Model\ClassModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClassRepository
{

    public function createClass(ClassModel $ClassModel)
    {
        $ClassModel->save();
        return response()->json(['success' => true, 'message' => 'Class was created successfully.']);
    }
    public function getAllClass()
    {
        $ClassModel =  new ClassModel();
        return  $ClassModel->with('class_teacher')->get();
    }
}
