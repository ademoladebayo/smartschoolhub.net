<?php

namespace App\Service;

use App\Model\ClassModel;
use App\Model\SubjectModel;
use App\Model\StudentModel;
use App\Model\TeacherModel;
use App\Repository\ClassRepository;
use App\Repository\SubjectRepository;
use App\Repository\StudentRepository;
use App\Repository\TeacherRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminService
{
    
    // CLASS
    public function createClass(Request $request)
    {
        $ClassModel = new ClassModel();
        $ClassRepository = new ClassRepository();

        $ClassModel->class_name =  $request->class_name;
        $ClassModel->class_teacher =  $request->class_teacher;


        if ($ClassModel->class_name != '') {
            return  $ClassRepository->createClass($ClassModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }

    public function editClass(Request $request)
    {
        $ClassRepository = new ClassRepository();
        return  $ClassRepository->editClass($request);
    }

    public function removeClassFromTeacher($class_id)
    {
        $TeacherRepository = new TeacherRepository();
        return  $TeacherRepository->removeClassFromTeacher($class_id);
    }

    // SUBJECT
    public function createSubject(Request $request)
    {
        $SubjectModel = new SubjectModel();
        $SubjectRepository = new SubjectRepository();

        $SubjectModel->subject_name =  $request->subject_name;
        $SubjectModel->teacher =  $request->teacher;
        $SubjectModel->class =  $request->class_id;


        if ($SubjectModel->subject_name !=  '' && $SubjectModel->class != '') {
            return  $SubjectRepository->createSubject($SubjectModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }

    // STUDENT
    public function createStudent(Request $request)
    {
        $studentModel = new StudentModel();
        $studentRepository = new StudentRepository();

        $studentModel->first_name =  $request->first_name;
        $studentModel->last_name =  $request->last_name;
        $studentModel->gender =  $request->gender;
        $studentModel->dob =  $request->dob;
        $studentModel->soo =  $request->soo;
        $studentModel->address =  $request->address;
        $studentModel->class =  $request->class;
        $studentModel->parent_phone =  $request->parent_phone;

        if ($studentModel->first_name != '' && $studentModel->last_name != '' && $studentModel->gender != '' && $studentModel->dob != '' && $studentModel->soo != ''  && $studentModel->address != '' && $studentModel->class != '' && $studentModel->parent_phone != '') {
            return  $studentRepository->createStudent($studentModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }

    // TEACHER
    public function createTeacher(Request $request)
    {
        $TeacherModel = new TeacherModel();
        $TeacherRepository = new TeacherRepository();

        $TeacherModel->first_name =  $request->first_name;
        $TeacherModel->last_name =  $request->last_name;
        $TeacherModel->gender =  $request->gender;
        $TeacherModel->address =  $request->address;
        $TeacherModel->phone =  $request->phone;
        $TeacherModel->email =  $request->email;

        if ($TeacherModel->first_name != '' && $TeacherModel->last_name != '' && $TeacherModel->gender != '' && $TeacherModel->address != '' && $TeacherModel->phone != '' && $TeacherModel->email != '') {
            return  $TeacherRepository->createTeacher($TeacherModel);
        } else {
            return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
        }
    }


    public function updateTeacherClass($teacher_id, $class_name)
    {
        $TeacherRepository = new TeacherRepository();
        return $TeacherRepository->updateTeacherClass($teacher_id, $class_name);
    }

    public function getAllTeacher()
    {
        $TeacherRepository = new TeacherRepository();
        return $TeacherRepository->getAllTeacher();
    }
}
