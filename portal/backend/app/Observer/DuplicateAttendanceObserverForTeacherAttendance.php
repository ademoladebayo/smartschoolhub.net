<?php

namespace App\Observer;

use App\Model\TeacherAttendanceModel;

class DuplicateAttendanceObserverForTeacherAttendance
{
    public function creating(TeacherAttendanceModel $teacherAttendanceModel)
    {
        try {

            // CHECK IF ALREADY TAKEN 
            $alreadyTaken = DB::table('teacher_attendance')->where("teacher_id", $teacherAttendanceModel->staff_id)->where('date', $teacherAttendanceModel->date)->exists();

            if ($alreadyTaken) {
                \Log::info('DuplicateAttendanceObserverForTeacherAttendance detected a duplicate attendance for staff ' . $teacherAttendanceModel->staff_id . ' on ' . $teacherAttendanceModel->date . ' and skipped it ... ');
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
