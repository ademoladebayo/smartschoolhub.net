<?php

namespace App\Service;

use App\Model\StudentModel;
use App\Model\CBTModel;
use App\Model\CBTResultModel;
use App\Model\SubjectRegistrationModel;
use App\Model\SubjectModel;
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
        $teacher = TeacherModel::where('teacher_id', $request->id)->with('assigned_class')->get()->first();
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

    public function registerSubject(Request $request)
    {
        // GET ID OF ALL STUDENT IN THE CLASS
        $students_id = [];

        foreach (StudentModel::select('id')->where('class', $request->class)->get() as $data) {
            array_push($students_id, $data->id);
        }

        // BEFORE PROCEEDING TO REGISTER , DELETE PREVIOUS COMPULSORY REGISTRATION FOR THAT CLASS
        $previous_registration_id = [];
        foreach (SubjectRegistrationModel::select("id")->where('class_id', $request->class)->Where('subject_type', 'COMPULSORY')->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
            array_push($previous_registration_id, $data->id);
        }
        SubjectRegistrationModel::destroy($previous_registration_id);




        // NOW REGISTER THE SUBJECT FOR ALL STUDENT IN $students_id

        Log::debug($students_id);
        Log::debug($request->subject_to_register);
        Log::debug(count($students_id));
        Log::debug(count($request->subject_to_register));

        for ($i = 0; $i < count($students_id); $i++) {

            for ($j = 0; $j < count($request->subject_to_register); $j++) {
                $SubjectRegistrationModel = new SubjectRegistrationModel();
                $SubjectRegistrationModel->subject_id = $request->subject_to_register[$j];
                $SubjectRegistrationModel->student_id = $students_id[$i];
                $SubjectRegistrationModel->subject_type = "COMPULSORY";
                $SubjectRegistrationModel->class_id = $request->class;
                $SubjectRegistrationModel->session =  $request->session;
                $SubjectRegistrationModel->term = $request->term;
                $SubjectRegistrationModel->save();
            }
        }





        return  response(['success' => true, 'message' => "Registration was successful."]);;
    }


    public function getRegisteredSubject(Request $request)
    {
        $previous_registration_id = [];
        if ($request->both_elective_and_compulsory) {
            foreach (SubjectRegistrationModel::select("subject_id")->where('class_id', $request->class)->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
                array_push($previous_registration_id, $data->subject_id);
            }
            return  $previous_registration_id;
        }

        foreach (SubjectRegistrationModel::select("subject_id")->where('class_id', $request->class)->Where('subject_type', 'COMPULSORY')->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
            array_push($previous_registration_id, $data->subject_id);
        }
        return  $previous_registration_id;
    }

    public function getAssignedSubject(Request $request)
    {
        return SubjectModel::where("teacher", $request->teacher_id)->with('class')->get();
    }

    // CBT

    public function createCBT(Request $request)
    {
        $CBTModel = new CBTModel();
        $CBTModel->cbt_title = $request->cbt_title;
        $CBTModel->cbt_date = $request->cbt_date;
        $CBTModel->start_time = $request->start_time;
        $CBTModel->cbt_duration = $request->cbt_duration;
        $CBTModel->cbt_instruction = $request->cbt_instruction;
        $CBTModel->cbt_question = $request->cbt_question;
        $CBTModel->cbt_options = $request->cbt_options;
        $CBTModel->cbt_answer = $request->cbt_answer;
        $CBTModel->cbt_questions_number = $request->cbt_questions_number;
        $CBTModel->subject_id = $request->subject_id;
        $CBTModel->class_id = $request->class_id;
        $CBTModel->session = $request->session;
        $CBTModel->term = $request->term;
        $CBTModel->save();

        return  response(['success' => true, 'message' => "CBT was created successfully"]);
    }

    public function editCBT(Request $request)
    {
        $CBTModel = CBTModel::find($request->cbt_id);

        $CBTModel->cbt_title = $request->cbt_title;
        $CBTModel->cbt_date = $request->cbt_date;
        $CBTModel->start_time = $request->start_time;
        $CBTModel->cbt_duration = $request->cbt_duration;
        $CBTModel->cbt_instruction = $request->cbt_instruction;
        $CBTModel->cbt_question = $request->cbt_question;
        $CBTModel->cbt_options = $request->cbt_options;
        $CBTModel->cbt_answer = $request->cbt_answer;
        $CBTModel->cbt_questions_number = $request->cbt_questions_number;
        $CBTModel->subject_id = $request->subject_id;
        $CBTModel->class_id = $request->class_id;
        $CBTModel->session = $request->session;
        $CBTModel->term = $request->term;
        $CBTModel->save();
        return  response(['success' => true, 'message' => "CBT Update was successful"]);
    }

    public function allCBT(Request $request)
    {
        return CBTModel::where("subject_id", $request->subject_id)->where("session", $request->session)->where("term", $request->term)->with('class', 'subject')->get();
    }

    public function deleteCBT($cbt_id)
    {
        $cbt = CBTModel::find($cbt_id);
        $cbt->delete();
        return response()->json(['success' => true, 'message' => 'CBT was deleted successfully.']);
    }

    public function getCBTResult($cbt_id)
    {
        return CBTResultModel::where("cbt_id", $cbt_id)->with("student")->get();
    }

    // RESULT UPLOAD
    public function getStudentRegistered(Request $request)
    {
        return SubjectRegistrationModel::where("subject_id", $request->subject_id)->where("session", $request->session)->where("term", $request->term)->with('student')->get();
    }

    public function uploadResult(Request $request)
    {
        $result = SubjectRegistrationModel::find($request->id);

        if ($request->result_type == "first_ca") {
            $result->first_ca = $request->score;
        } else if ($request->result_type == "second_ca") {
            $result->second_ca = $request->score;
        } else {
            $result->examination = $request->score;
        }

        $result->save();
        return response()->json(['success' => true, 'message' => 'Result updated']);
    }
}
