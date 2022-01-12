<?php

namespace App\Service;

use App\Model\CBTModel;
use App\Model\CBTResultModel;
use App\Model\ClassModel;
use App\Model\FeeModel;
use App\Model\PaymentHistoryModel;
use App\Model\StudentModel;
use App\Model\SubjectRegistrationModel;
use App\Repository\StudentRepository;
use App\Repository\SubjectRegistrationRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $class = StudentModel::select('class')->where('id', $request->student_id)->get()[0]->class;
        $class_sector = ClassModel::select('class_sector')->where('id', $class)->get()[0]->class_sector;
        $fees =  FeeModel::where('class', $class)->orWhere('class', $class_sector)->orWhere('class', 'ALL STUDENT')->where('session', $request->session)->where('term', $request->term)->get();

        $payment_history = PaymentHistoryModel::select('amount')->where('student_id', $request->student_id)->where('session', $request->session)->where('term', $request->term)->get();


        // GET EXPECTED TOTAL
        $expected_amount = 0;
        foreach ($fees as $fee) {
            $expected_amount = $expected_amount + intval($fee->amount);
        }

        // GET TOTAL PAID
        $total_paid = 0;
        foreach ($payment_history as $payment) {
            $total_paid = $total_paid + intval($payment->amount);
        }



        return ['fee_breakdown' => $fees, 'expected_amount' => $expected_amount, 'total_paid' => $total_paid, 'due_balance' => ($expected_amount - $total_paid)];
    }
}
