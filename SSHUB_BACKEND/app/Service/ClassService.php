<?php

namespace App\Service;

use App\Model\ClassModel;
use App\Repository\ClassRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClassService
{
    public function createClass(Request $request)
    {
        $ClassModel = new ClassModel();
        $ClassRepository = new ClassRepository();

        $ClassModel->class_name =  $request->class_name;
        $ClassModel->class_teacher =  $request->class_teacher;
        

        if ($ClassModel->class_name != '' && $ClassModel->class_teacher != '' ) {
            return  $ClassRepository->createClass($ClassModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }
}
