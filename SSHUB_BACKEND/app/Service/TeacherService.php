<?php

namespace App\Service;

use App\Model\TeacherModel;
use App\Repository\TeacherRepository;
use App\Repository\SubjectRepository;
use App\Repository\StudentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;

class TeacherService
{

    // SIGNIN
    public function signIn(Request $request)
    {
        $TeacherRepository = new TeacherRepository();
        $teacher = TeacherModel::where('teacher_id', $request->id)->get()->first();
        if ($teacher == null) {
            return  response(['success' => false, 'message' => "Invalid Teacher!"]);
        } else {

            if ($TeacherRepository->getPassword($request->id) == $request->password) {
                $token = $teacher->createToken('token')->plainTextToken;
                // $cookie = cookie('jwt', $token, 1);
                $cookie = Cookie::make('jwt', $token, 1);
                return  response(['token' => $token, 'success' => true, 'message' => 'Welcome, ' . $teacher->first_name, 'data' => $teacher, 'dashboard_information' => $this->getDashBoardInformation($teacher)])->withCookie($cookie);
            } else {
                return  response(['success' => false, 'message' => "Invalid Password"]);
            }
        }
    }

    public function getDashBoardInformation($teacher)
    {
        $SubjectRepository = new SubjectRepository();
        $StudentRepository = new StudentRepository();
        // NUMBER OF STUDENT IN MY CLASS
        // NUMBER OF SUBJECT I TAKE
        if ($teacher->assigned_class == '-') {
            return ['no_of_assigned_subject' => $SubjectRepository->getNoOfAssignedSubject($teacher->id), 'no_of_student' => 0, 'male' => 0, 'female' => 0, 'events' => null, "notification" => null];
        }

        return ['no_of_assigned_subject' => $SubjectRepository->getNoOfAssignedSubject($teacher->id), 'no_of_student' => $StudentRepository->getNoOfClassStudent($teacher->assigned_class)[0], 'male' =>  $StudentRepository->getNoOfClassStudent($teacher->assigned_class)[1], 'female' =>  $StudentRepository->getNoOfClassStudent($teacher->assigned_class)[2], 'events' => null, "notification" => null];
    }
}
