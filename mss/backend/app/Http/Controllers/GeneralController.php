<?php

namespace App\Http\Controllers;

use App\Repository\SessionRepository;
use App\Service\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class GeneralController extends Controller
{
    // SIGNIN
    public function getCurrentSession()
    {
        $SessionRepository = new SessionRepository();
        return $SessionRepository->getCurrentSession();
    }

    // SCHOOL DETAILS
    function getSchoolDetails()
    {
        return DB::table('school_details')->get();
    }

    // ALL SESSION
    function allSession($desc)
    {
        if($desc != null){
            return DB::table('session')->select('session')->orderBy('id', 'DESC')->get();
        }
        return DB::table('session')->select('session')->get();
    }
}
