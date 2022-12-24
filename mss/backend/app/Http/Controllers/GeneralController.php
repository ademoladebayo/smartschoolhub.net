<?php

namespace App\Http\Controllers;

use App\Repository\SessionRepository;
use App\Service\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
    function allSession($sort)
    {
        if (str_contains($sort, 'STD')) {
            $result_session = DB::select('SELECT distinct session,  term FROM subject_registration where student_id =' . explode("-", $sort)[1]);
            return  $result_session;
        } else {
            if ($sort == "DESC") {
                return DB::table('session')->select('session')->orderBy('id', 'DESC')->get();
            }
            return DB::table('session')->select('session')->get();
        }
    }

    function storedCredentials()
    {
        return response(['PSPK' => env('PAYSTACK_PRIVATE_KEY'), 'PSSK' => env('PAYSTACK_SECRET_KEY')]);
    }
}
