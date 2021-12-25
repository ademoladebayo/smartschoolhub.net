<?php

namespace App\Http\Controllers;

use App\Model\VisitorModel;
use App\Repository\ClassRepository;
use App\Service\VisitorService;
use App\Repository\SubjectRepository;
use App\Repository\TeacherRepository;
use App\Repository\StudentRepository;
use App\Model\SessionModel;
use App\Model\TeacherModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class VisitorController extends Controller
{
    public function saveVisitor(Request $request)
    {
        $VisitorService = new VisitorService();
        return $VisitorService->saveVisitor($request);
    }


}
