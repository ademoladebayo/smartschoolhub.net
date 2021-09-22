<?php

namespace App\Http\Controllers;

use App\Model\SubjectModel;
use App\Repository\SubjectRepository;
use App\Service\SubjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SubjectController extends Controller
{
    public function createSubject(Request $request)
    {
        $SubjectService = new SubjectService();
        return $SubjectService->createSubject($request);
    }
    
    public function getAllSubject()
    {
        $subjectRepository = new SubjectRepository();
        return $subjectRepository->getAllSubject();
    }
}
