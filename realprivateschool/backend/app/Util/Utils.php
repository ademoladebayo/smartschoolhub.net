<?php

namespace App\Util;

use App\Model\ActivityLogModel;
use App\Model\AdminModel;
use App\Model\BursaryModel;
use App\Model\StudentModel;
use App\Model\TeacherModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Utils
{
    function getPosition($number)
    {
        $ends = array('th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th');
        if ((($number % 100) >= 11) && (($number % 100) <= 13))
            return $number . 'th';
        else
            return $number . $ends[$number % 10];
    }


    function getLoggedInUser($token)
    {
        // Bearer 1879|eFWVAg8ZOcFknibEzb5rFaVQg5C8a2X4HsijIBSf 
        $token_id = trim(explode(" ", explode("|", $token)[0])[1]);
        $token_data = DB::table("personal_access_tokens")->where("id", $token_id)->get()[0];
        //Log::debug("TOKEN DATA ::::: ". $token_data);
        $user_type = explode("\\", $token_data->tokenable_type)[2];
        $user_id = $token_data->tokenable_id;

        if (str_contains($user_type, "Student")) {
            $user =   StudentModel::where("id", $user_id)->get()[0];
            return "STUDENT | " . $user->first_name . " " . $user->last_name;
        } else if (str_contains($user_type, "Teacher")) {
            $user =   TeacherModel::where("id", $user_id)->get()[0];
            return "TEACHER | " . $user->first_name . " " . $user->last_name;
        } else if (str_contains($user_type, "Bursary")) {
            $user =   BursaryModel::where("id", $user_id)->get()[0];
            return "BURSAR | " . $user->username;
        } else {
            $user =   AdminModel::where("id", $user_id)->get()[0];
            return "ADMIN | " . $user->username;
        }
    }


    function logUserActivity($token, ActivityLogModel $activityLog)
    {
        $activityLog->user = $this->getLoggedInUser($token);
        $activityLog->date = date("d/m/Y");
        $activityLog->save();
        //Log::debug(ActivityLogModel::get());
    }
}
