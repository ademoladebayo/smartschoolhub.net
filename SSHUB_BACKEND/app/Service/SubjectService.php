<?php

namespace App\Service;

use App\Model\SubjectModel;
use App\Repository\SubjectRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SubjectService
{
    public function createSubject(Request $request)
    {
        $SubjectModel = new SubjectModel();
        $SubjectRepository = new SubjectRepository();

        $SubjectModel->subject_name =  $request->subject_name;
        $SubjectModel->teacher =  $request->teacher;
        $SubjectModel->class =  $request->class;


        if ($SubjectModel->subject_name != '' && $SubjectModel->teacher != '' && $SubjectModel->class != '' ) {
            return  $SubjectRepository->createSubject($SubjectModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }
}
