<?php

namespace App\Http\Controllers;

use App\Model\AffilateModel;
use App\Model\VisitorModel;
use App\Repository\ClassRepository;
use App\Service\AffilateService;
use App\Repository\SubjectRepository;
use App\Repository\TeacherRepository;
use App\Repository\StudentRepository;
use App\Model\SessionModel;
use App\Model\TeacherModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class AffilateController extends Controller
{
    public function createAffilate(Request $request)
    {
        $AffilateService = new AffilateService();
        return $AffilateService->createAffilate($request);
    }


}
