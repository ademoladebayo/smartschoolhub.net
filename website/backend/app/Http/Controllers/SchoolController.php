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
use Illuminate\Support\Facades\DB;

class SchoolController extends Controller
{
    public function getSchools()
    {
        return DB::table('schools')->orderBy("name", "ASC")->get();
    }
}
