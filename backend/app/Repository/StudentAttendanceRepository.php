<?php

namespace App\Repository;

use Illuminate\Http\Request;
use App\Model\StudentAttendanceModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudentAttendanceRepository
{

    public function takeAttendance(Request $request)
    {
        $StudentAttendanceModel = new StudentAttendanceModel();

        // CHECK IF ALREADY TAKEN 
        $alreadytaken = DB::table('student_attendance')->where("student_id", $request->student_id)->where('date', $request->date)->exists();

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
}
