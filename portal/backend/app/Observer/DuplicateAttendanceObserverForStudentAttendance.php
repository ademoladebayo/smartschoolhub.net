<?php

namespace App\Observer;

use App\Model\StudentAttendanceModel;
use Illuminate\Support\Facades\DB;

class DuplicateAttendanceObserverForStudentAttendance
{
    public function creating(StudentAttendanceModel $studentAttendanceModel)
    {
        try {

            // CHECK IF ALREADY TAKEN 
            $alreadyTaken = DB::table('student_attendance')->where("student_id", $studentAttendanceModel->student_id)->where('date', $studentAttendanceModel->date)->exists();

            if ($alreadyTaken) {
                \Log::info('DuplicateAttendanceObserverForStudentAttendance detected a duplicate attendance for student ' . $studentAttendanceModel->student_id . ' on ' . $studentAttendanceModel->date . ' and skipped it ... ');
                return false;
            }

            // Continue with the saving operation
            return true;

        } catch (\Throwable $th) {
            \Log::info($th);
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Something went wrong, Please try again. ',
                    'error' => $th->getMessage(),
                ],
                500,
            );
        }
    }
}
