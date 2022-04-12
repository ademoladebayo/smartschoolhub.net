<?php

namespace App\Service;

use App\Model\CBTModel;
use App\Model\CBTResultModel;
use App\Model\ClassModel;
use App\Model\DebitorModel;
use App\Model\FeeModel;
use App\Model\PaymentHistoryModel;
use App\Model\StudentAttendanceModel;
use App\Model\StudentModel;
use App\Model\StudentResultCommentModel;
use App\Model\StudentResultRatingModel;
use App\Model\SubjectRegistrationModel;
use App\Repository\StudentRepository;
use App\Repository\SubjectRegistrationRepository;
use App\Repository\GradeSettingsRepository;
use App\Util\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class StudentService
{
    // SIGNIN
    public function signIn(Request $request)
    {
        $StudentRepository = new StudentRepository();
        $student = StudentModel::where('student_id', $request->id)->with('class')->get()->first();
        if ($student == null) {
            return  response(['success' => false, 'message' => "Invalid Student!"]);
        } else {

            if ($StudentRepository->getPassword($request->id) == $request->password) {
                // Check if account is disabled
                if ($student->profile_status == "DISABLED") {
                    return  response(['success' => false, 'message' => "😔Your account has been disabled, contact the school admin."]);
                }

                $token = $student->createToken('token')->plainTextToken;
                return  response(['token' => $token, 'success' => true, 'message' => 'Welcome, ' . $student->first_name, 'data' => $student, 'dashboard_information' => $this->getDashBoardInformation($student)]);
            } else {
                return  response(['success' => false, 'message' => "Invalid Password"]);
            }
        }
    }

    // SUBJECT
    public function registerSubject(Request $request)
    {

        // GET PREVIOUS REGISTRATION FOR STUDENT
        $previous_registration_id = [];
        foreach (SubjectRegistrationModel::select("subject_id")->where('student_id', $request->student_id)->where('class_id', $request->class)->Where('subject_type', 'ELECTIVE')->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
            array_push($previous_registration_id, $data->subject_id);
        }
        Log::debug("PREVIOUS REGISTRATION : ");
        Log::debug($previous_registration_id);

        // GET THE DIFFRENCE BETWEEN THE PREVIOUS AND NEW REGISTRATION
        $subject_to_register = [];
        $subject_to_delete = [];

        // NEW SUBJECT TO REGISTER
        $diffrence = array_diff($request->subject_to_register, $previous_registration_id);
        foreach ($diffrence as $diff) {
            array_push($subject_to_register, $diff);
        }

        // SUBJECT TO DELETE
        $diffrence = array_diff($previous_registration_id, $request->subject_to_register);

        foreach ($diffrence as $diff) {
            array_push($subject_to_delete, $diff);
        }

        // DELETE SUBJECTS
        foreach ($subject_to_delete as $subject) {
            SubjectRegistrationModel::where('student_id', $request->student_id)->where('class_id', $request->class)->where('subject_id', $subject)->Where('subject_type', 'ELECTIVE')->Where('session', $request->session)->Where('term', $request->term)->delete();
        }

        Log::debug("SUBJECT TO REGISTER");
        Log::debug($subject_to_register);
        Log::debug("SUBJECT TO DELETE");
        Log::debug($subject_to_delete);


        // NOW REGISTER THE SUBJECTS
        for ($j = 0; $j < count($subject_to_register); $j++) {
            $SubjectRegistrationModel = new SubjectRegistrationModel();
            $SubjectRegistrationModel->subject_id = $subject_to_register[$j];
            $SubjectRegistrationModel->student_id =  $request->student_id;
            $SubjectRegistrationModel->subject_type = "ELECTIVE";
            $SubjectRegistrationModel->class_id = $request->class;
            $SubjectRegistrationModel->session =  $request->session;
            $SubjectRegistrationModel->term = $request->term;
            $SubjectRegistrationModel->save();
        }


        return  response(['success' => true, 'message' => count($subject_to_register) . " Registration was successful."]);
    }


    public function getRegisteredSubject(Request $request)
    {
        $SubjectRegistrationRepository = new SubjectRegistrationRepository();
        return $SubjectRegistrationRepository->getRegisteredSubject($request);
        // return SubjectRegistrationModel::where('student_id', $request->student_id)->with('subject',)->where('class_id', $request->class)->Where('subject_type', 'COMPULSORY')->Where('session', $request->session)->Where('term', $request->term)->get();
    }

    public function getRegisteredSubjectID(Request $request)
    {
        $previous_registration_id = [];
        foreach (SubjectRegistrationModel::select("subject_id")->where('student_id', $request->student_id)->where('class_id', $request->class)->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
            array_push($previous_registration_id, $data->subject_id);
        }
        return  $previous_registration_id;
    }



    public function getDashBoardInformation($student)
    {
        return ['cbt' => null, 'attendance' => null, 'due_balance' => null, 'events' => null, "notification" => null];
    }

    // CBT
    public function checkIfStudenHasTakenCBT($cbt_id, $student_id)
    {
        // $studentHasTakenCBT = false;
        count(CBTResultModel::where('cbt_id', $cbt_id)->where('student_id', $student_id)->get()) < 1 ?  $studentHasTakenCBT = false :  $studentHasTakenCBT = true;
        return  response(['taken' => $studentHasTakenCBT]);;
    }

    public function submitCBT(Request $request)
    {
        $CBTResult = new CBTResultModel();
        $CBTResult->cbt_id = $request->cbt_id;
        $CBTResult->student_id = $request->student_id;
        $CBTResult->score = $this->markCBTAndGetScore($request->cbt_id, $request->student_answer);
        $CBTResult->answer = implode(",", $request->student_answer);
        $CBTResult->save();

        return  response(['result' => "You scored " . $CBTResult->score . " out of " . count($request->student_answer)]);
    }
    public function markCBTAndGetScore($cbt_id, $student_answer)
    {
        $score = 0;
        $cbt_answer = explode(",", CBTModel::find($cbt_id)->cbt_answer);

        for ($i = 0; $i < count($cbt_answer); $i++) {
            if ($cbt_answer[$i] == $student_answer[$i]) {
                $score = $score + 1;
            }
        }

        return $score;
    }

    // FEE AND PAYMENT
    function allFee(Request $request)
    {
        $bursaryService = new BursaryService();
        $class = StudentModel::select('class')->where('id', $request->student_id)->get()[0]->class;
        $class_sector = ClassModel::select('class_sector')->where('id', $class)->get()[0]->class_sector;
        $fees =  FeeModel::where('class', $class)->where('session', $request->session)->where('term', $request->term)
            ->orWhere('class', $class_sector)->where('session', $request->session)->where('term', $request->term)
            ->orWhere('class', 'ALL STUDENT')->where('session', $request->session)->where('term', $request->term)->get();

        $expected_fee = 0;
        $optional_fee = 0;
        $total_paid = 0;
        $arrears = 0;


        // SO GET STUDENT'S, GET EXPECTED FEE FOR THE TERM + THEIR REQUESTED OPTIONAL, TOTAL PAID , ARREARS AND TOTAL BALANCE
        $expected_fee = $bursaryService->getPayableForClass($class, $request->session, $request->term);
        $optional_fee = $bursaryService->getOptionalFeeRequest($request->student_id, $request->session, $request->term);
        $total_paid =  $bursaryService->getTotalPaid($request->student_id, $request->session, $request->term);
        $arrears = DebitorModel::select("amount", "last_checked")->where("student_id", $request->student_id)->get();
        Log::alert("ARREARS : " . $arrears);

        if (count($arrears) > 0) {
            $student["last_checked"] = $arrears[0]->last_checked;
            $arrears = $arrears[0]->amount;
        } else {
            $arrears = 0;
        }


        return ['fee_breakdown' => $fees, 'expected_amount' => $expected_fee + $optional_fee, 'total_paid' => $total_paid, 'optional_fee' => $optional_fee, 'due_balance' => ($expected_fee - $total_paid), 'arrears' => $arrears, 'total_due_balance' => $arrears + ($expected_fee - $total_paid)];
    }

    // RESULT
    public function getResult(Request $request)
    {
        // PERCENTAGE AND GRADE POSITION
        $percentage = 0;
        $score_accumulator = 0;
        $no_subject = 0;
        $grade_position = '';



        $result =  SubjectRegistrationModel::select('id', 'student_id', 'subject_id', 'class_id', 'first_ca', 'second_ca', 'examination', DB::raw('(first_ca + second_ca + examination) as total'))->where("student_id", $request->student_id)->where("session", $request->session)->where("term", $request->term)->with('student', 'class', 'subject')->get();
        $no_student = DB::select('select count(distinct student_id) as no_student from subject_registration where class_id ="' . $request->class_id . '" and session ="' . $request->session . '" and term ="' . $request->term . '"')[0]->no_student;

        // LOOP THROUGH RESULT AND ATTACH GRADE
        foreach ($result as $data) {
            // POSITION VARIABLE
            $all_score = [];

            // TAKE EACH TOTAL SCORE AND GET GRADE , REMARK , AVG , MIN ,MAX AND POSITION
            $avg =  SubjectRegistrationModel::select(DB::raw('avg(total) as avg'))->where("subject_id", $data->subject_id)->where("session", $request->session)->where("term", $request->term)->get()[0]->avg;
            $min =  SubjectRegistrationModel::select(DB::raw('min(total) as min'))->where("subject_id", $data->subject_id)->where("session", $request->session)->where("term", $request->term)->get()[0]->min;
            $max =  SubjectRegistrationModel::select(DB::raw('max(total) as max'))->where("subject_id", $data->subject_id)->where("session", $request->session)->where("term", $request->term)->get()[0]->max;
            $scores =  SubjectRegistrationModel::select(DB::raw('(first_ca + second_ca + examination) as total'))->where("subject_id", $data->subject_id)->where("session", $request->session)->where("term", $request->term)->get();




            // PUSH ALL SCORE TO ARRAY TO GET POSITION
            foreach ($scores as $score) {
                array_push($all_score, intval($score->total));
            }

            // SORT SCORE FROM H - L
            rsort($all_score);

            Log::alert($all_score);

            $GradeSettingsRepository  = new GradeSettingsRepository();
            $util = new Utils();

            $gradeAndRemark =  $GradeSettingsRepository->getGradeAndRemark($data->total);
            $data['grade'] = count($gradeAndRemark) != 0 ? $gradeAndRemark[0]->grade : '--';
            $data['remark'] = count($gradeAndRemark) != 0 ? $gradeAndRemark[0]->remark : '--';
            $data['class_average'] = $avg;
            $data['class_lowest'] = $min;
            $data['class_highest'] = $max;
            $data['position'] =  $util->getPosition(array_search(intval($data->total), $all_score) + 1);


            // GET SCORE TOTAL
            $score_accumulator += intval($data->total);
            $no_subject++;
        }
        $GradeSettingsRepository  = new GradeSettingsRepository();

        $percentage = $no_subject != 0 ? $score_accumulator / $no_subject  : 0;

        $gradeAndRemark =  $GradeSettingsRepository->getGradeAndRemark($percentage);
        $grade_position = count($gradeAndRemark) != 0 ? $gradeAndRemark[0]->grade : '--';


        return response()->json(['result' => $result, 'percentage' => $percentage . '%', 'grade_position' => $grade_position, 'no_student' => $no_student]);
    }


    public function getCommentsAndPsycho(Request $request)
    {
        $teacher_comment =  StudentResultCommentModel::select('class_teacher_comment')->where("student_id", $request->student_id)->where("session", $request->session)->where("term", $request->term)->get();
        $student_rating =  StudentResultRatingModel::where("student_id", $request->student_id)->where("session", $request->session)->where("term", $request->term)->get();

        $teacher_comment = count($teacher_comment) != 0 ? $teacher_comment[0]->class_teacher_comment : '';
        $student_rating = count($student_rating) != 0 ? $student_rating[0] : '';

        return response()->json(['teacher_comment' => $teacher_comment, 'student_rating' => $student_rating]);
    }

    // ATTENDANCE
    public function attendanceSummary(Request $request)
    {
        $Days = [];
        $DaysOpened = StudentAttendanceModel::select("date")->where("session", $request->session)->where("term", $request->term)->get();
        $AttendanceSummary = StudentAttendanceModel::where('student_id', $request->student_id)->where("session", $request->session)->where("term", $request->term)->orderBy('id', 'DESC')->get();

        foreach ($DaysOpened as $day) {
            array_push($Days, $day->date);
        }

        $opened = count(array_unique($Days));
        $present = count($AttendanceSummary);
        $absent = intval($opened) - intval($present);
        return response()->json(['opened' => $opened, 'present' => $present, 'absent' => $absent, 'attendance_summary' => $AttendanceSummary]);
    }
}
