<?php

namespace App\Repository;

use App\Model\ClassModel;
use App\Service\AdminService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubjectRegistrationRepository
{
    public function registerSubject()
    {
    }

    public function getRegisteredSubject(Request $request)
    {
        return  DB::table('subject_registration')
            ->where('student_id', $request->student_id)
            ->where('class_id', $request->class)
            // ->where('subject_type', 'COMPULSORY')
            ->where('session', $request->session)
            ->where('term', $request->term)
            ->join('subject', 'subject_registration.subject_id', '=', 'subject.id')
            ->join('teacher', 'subject.teacher', '=', 'teacher.id')
            ->select('subject_registration.subject_type', 'subject.subject_name', 'subject_registration.subject_id', 'subject.teacher', DB::raw('CONCAT(teacher.title, " ", teacher.first_name, " ", teacher.last_name) as teacher'))
            ->get();
    }
}
