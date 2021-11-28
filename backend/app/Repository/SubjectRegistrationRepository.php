<?php

namespace App\Repository;

use App\Model\ClassModel;
use App\Service\AdminService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\db;

class SubjectRegistrationRepository
{
    public function registerSubject()
    {
    }

    public function getRegisteredSubject(Request $request)
    {

        // return DB::select(
        //     'select subject_registration.subject_name , subject_registration.subject_type , teacher.id ,
        //  CONCAT(teacher.title, " ", teacher.first_name, " ", teacher.last_name) as teacher  
        // from  subject_registration 
        // where (student_id = "' . $request->student_id .
        //         '" and  class_id = "' . $request->class .
        //         '" and  subject_type = "COMPULSORY" 
        //   and  session = "' . $request->session .
        //         '" and   term = "' . $request->term .
        //         '")  

        // inner join  subject on subject_registration.subject_id = subject.id
        // inner join  teacher on subject.teacher = teacher.id'
        // );


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
