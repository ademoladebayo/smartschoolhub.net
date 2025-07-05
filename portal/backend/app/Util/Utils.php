<?php

namespace App\Util;

use App\Model\ActivityLogModel;
use App\Model\AdminModel;
use App\Model\BursaryModel;
use App\Model\Settings;
use App\Model\StudentModel;
use App\Model\TeacherModel;
use DateTime;
use Illuminate\Support\Facades\DB;
use App\Model\SessionModel;
use Illuminate\Support\Facades\Hash;
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
            $user = StudentModel::where("id", $user_id)->get()[0];
            return "STUDENT | " . $user->first_name . " " . $user->last_name;
        } else if (str_contains($user_type, "Teacher")) {
            $user = TeacherModel::where("id", $user_id)->get()[0];
            return "TEACHER | " . $user->first_name . " " . $user->last_name;
        } else if (str_contains($user_type, "Bursary")) {
            $user = BursaryModel::where("id", $user_id)->get()[0];
            return "BURSAR | " . $user->username;
        } else {
            $user = AdminModel::where("id", $user_id)->get()[0];
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

    function getCurrentSession()
    {
        // GET CURRENT SESSION AND TERM
        $session = SessionModel::select('session', 'term')->where('session_status', 'CURRENT')->get()[0]->session;
        $term = SessionModel::select('session', 'term')->where('session_status', 'CURRENT')->get()[0]->term;
        return [$session, $term];
    }

    function tokenExpired($token)
    {
        $token_id = trim(explode(" ", explode("|", $token)[0])[1]);
        $token_data = DB::table("personal_access_tokens")->where("id", $token_id)->get()[0];

        $currentDateTime = new DateTime();
        $createDateTime = new DateTime($token_data->created_at);

        // Calculate the difference in minutes
        $interval = $currentDateTime->diff($createDateTime);
        $minutesDifference = $interval->days * 24 * 60 + $interval->h * 60 + $interval->i;
        //log::alert("TOKEN IS " . $minutesDifference . "MINUTES OLD");

        if ($minutesDifference > 60) {
            return true;
        }
    }

    public static function checkPasswordRehashed($user_type, $user_id, $password)
    {
        // Bcrypt format check ($2y$ followed by cost parameter)
        if (!preg_match('/^\$2[ayb]\$.{56}$/', $password)) {

            if ($user_type == "STUDENT") {
                $user = StudentModel::where("id", $user_id)->get()[0];
            } else if ($user_type == "TEACHER") {
                $user = TeacherModel::where("id", $user_id)->get()[0];
            } else if ($user_type == "BURSAR") {
                $user = BursaryModel::where("id", $user_id)->get()[0];
            } else {
                $user = AdminModel::where("id", $user_id)->get()[0];
            }

            $user->password = Hash::make($password);
            $user->save();

            return true;
        }

        return false;
    }

    public static function runSettingsSeeder()
    {
        $result_format = json_encode([
            "sn" => [
                "header" => "S/N",
                "status" => "active"
            ],
            "fullname" => [
                "header" => "Student Fullname",
                "status" => "active"
            ],
            "first_test" => [
                "header" => "First Test",
                "status" => "active"
            ],
            "second_test" => [
                "header" => "Second Test",
                "status" => "active"
            ],
            "note_ass" => [
                "header" => "Note/Ass",
                "status" => "active"
            ],
            "cbt" => [
                "header" => "CBT",
                "status" => "active"
            ],
            "project" => [
                "header" => "Project",
                "status" => "active"
            ],
            "exam" => [
                "header" => "Exam",
                "status" => "active"
            ],
            "total" => [
                "header" => "Total",
                "status" => "active"
            ],
            "grade" => [
                "header" => "Grade",
                "status" => "active"
            ],
            "remark" => [
                "header" => "Remark",
                "status" => "active"
            ]
        ]);


        $settings = [
            'ALLOW_MANUAL_ATTENDANCE' => 'NO',
            'KG_RESULT_FORMAT' => $result_format,
            'NURSERY_RESULT_FORMAT' => $result_format,
            'PRIMARY_RESULT_FORMAT' => $result_format,
            'JUNIOR_SECONDARY_RESULT_FORMAT' => $result_format,
            'SENIOR_SECONDARY_RESULT_FORMAT' => $result_format,
        ];

        foreach ($settings as $key => $value) {
            if (Settings::where('key', $key)->exists()) {
                continue;
            }

            $settingsModel = new Settings();
            $settingsModel->key = $key;
            $settingsModel->value = $value;
            $settingsModel->save();
        }

    }


    public static function runSeeder()
    {
        self::runSettingsSeeder();
        return "Seeder run successfully";
    }

    public static function getSettings($key)
    {
        return Settings::where('key', $key)->first()->value ?? null;
    }

    public static function getResultFormat($class_sector)
    {
        Log::debug("GETTING RESULT FORMAT FOR CLASS SECTOR: " . $class_sector);
        switch ($class_sector) {
            case "NURSERY SCHOOL":
                return self::getSettings("NURSERY_RESULT_FORMAT");
            case "PRIMARY SCHOOL":
                return self::getSettings("PRIMARY_RESULT_FORMAT");
            case "JUNIOR SECONDARY SCHOOL":
                return self::getSettings("JUNIOR_SECONDARY_RESULT_FORMAT");
            case "SENIOR SECONDARY SCHOOL":
                return self::getSettings("SENIOR_SECONDARY_RESULT_FORMAT");
            default:
                return self::getSettings("KG_RESULT_FORMAT");
        }
    }
}