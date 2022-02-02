<?php

namespace App\Repository;

use Illuminate\Http\Request;
use App\Model\StudentAttendanceModel;
use App\Model\StudentModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudentAttendanceRepository
{

    public function takeAttendance(Request $request)
    {
        $StudentAttendanceModel = new StudentAttendanceModel();

        //   USING STUDENT NUMBER
        if ($request->class_id == "") {
            // CHECK IF STUDENT ID EXIST
            $student = StudentModel::where("student_id", $request->student_id)->get();
            if (count($student) != 0) {

                // CHECK IF ALREADY TAKEN 
                $request->student_id = $student[0]->id;
                $alreadytaken =  $this->takenAttendance($request);

                if ($alreadytaken) {
                    return response()->json(['success' => false, 'message' => 'Attendance has already been taken.']);
                }
                // GET CLASS
                $StudentAttendanceModel->student_id = $student[0]->id;
                $StudentAttendanceModel->class_id = $student[0]->class;
                $StudentAttendanceModel->date = $request->date;
                $StudentAttendanceModel->time = $request->time;
                $StudentAttendanceModel->session = $request->session;
                $StudentAttendanceModel->term = $request->term;
                $StudentAttendanceModel->save();
                return response()->json(['success' => true, 'message' => 'Attendance was successfully.']);
            } else {
                return response()->json(['success' => false, 'message' => 'Invalid Student ID']);
            }
        }


        //   USING CARD
        // CHECK IF ALREADY TAKEN 
        $alreadytaken =  $this->takenAttendance($request);

        if ($alreadytaken) {
            return response()->json(['success' => false, 'message' => 'Attendance has already been taken.']);
        }

        $StudentAttendanceModel->student_id = $request->student_id;
        $StudentAttendanceModel->class_id = $request->class_id;
        $StudentAttendanceModel->date = $request->date;
        $StudentAttendanceModel->time = $request->time;
        $StudentAttendanceModel->session = $request->session;
        $StudentAttendanceModel->term = $request->term;
        $StudentAttendanceModel->save();
        return response()->json(['success' => true, 'message' => 'Attendance was successfully.']);
    }

    public function getAttendance(Request $request)
    {

        $StudentAttendanceModel =  new StudentAttendanceModel();
        return  $StudentAttendanceModel->with('student', 'class')->where('date', $request->date)->get();
    }

    public function takenAttendance(Request $request)
    {
        // CHECK IF ALREADY TAKEN 
        return DB::table('student_attendance')->where("student_id", $request->student_id)->where('date', $request->date)->exists();
    }
}
