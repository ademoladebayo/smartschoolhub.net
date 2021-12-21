<?php

namespace App\Http\Controllers;

use App\Model\AdminModel;
use App\Repository\ClassRepository;
use App\Service\AdminService;
use App\Repository\SubjectRepository;
use App\Repository\TeacherRepository;
use App\Repository\StudentRepository;
use App\Model\SessionModel;
use App\Model\TeacherModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // SIGNIN
    public function signIn(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->signIn($request);
    }


    // CLASS
    public function createClass(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createClass($request);
    }

    public function editClass(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->editClass($request);
    }

    public function getAllClass()
    {
        $classRepository = new ClassRepository();
        return $classRepository->getAllClass();
    }

    public function deleteClass($class_id)
    {
        $classRepository = new ClassRepository();
        return $classRepository->deleteClass($class_id);
    }

    public function searchClass($class_name)
    {
        $classRepository = new ClassRepository();
        return $classRepository->searchClass($class_name);
    }

    // SUBJECT
    public function createSubject(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createSubject($request);
    }

    public function getAllSubject()
    {
        $subjectRepository = new SubjectRepository();
        return $subjectRepository->getAllSubject();
    }

    public function editSubject(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->editSubject($request);
    }
    public function deleteSubject($subject_id)
    {
        $subjectRepository = new SubjectRepository();
        return $subjectRepository->deleteSubject($subject_id);
    }

    public function searchSubject($subject_name)
    {
        $subjectRepository = new SubjectRepository();
        return $subjectRepository->searchSubject($subject_name);
    }

    // STUDENT
    public function createStudent(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createStudent($request);
    }

    public function editStudent(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->editStudent($request);
    }

    public function getAllStudent()
    {
        $AdminService = new AdminService();
        return $AdminService->getAllStudent();
    }

    public function deleteStudent($student_id)
    {
        $StudentRepository = new StudentRepository();
        return $StudentRepository->deleteStudent($student_id);
    }

    public function searchStudent($search_data)
    {
        $StudentRepository = new StudentRepository();
        return $StudentRepository->searchStudent($search_data);
    }

    public function updateStudentProfileStatus($id)
    {
        $StudentRepository = new StudentRepository();
        return $StudentRepository->updateStudentProfileStatus($id);
    }


    // TEACHER
    public function createTeacher(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createTeacher($request);
    }

    public function editTeacher(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->editTeacher($request);
    }

    public function getAllTeacher()
    {
        $AdminService = new AdminService();
        return $AdminService->getAllTeacher();
    }

    public function deleteTeacher($teacher_id)
    {
        $TeacherRepository = new TeacherRepository();
        return $TeacherRepository->deleteTeacher($teacher_id);
    }

    public function searchTeacher($search_data)
    {
        $TeacherRepository = new TeacherRepository();
        return $TeacherRepository->searchTeacher($search_data);
    }

    public function updateTeacherProfileStatus($id)
    {
        $TeacherRepository = new TeacherRepository();
        return $TeacherRepository->updateTeacherProfileStatus($id);
    }
    // SESSION
    public function createSession(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createSession($request);
    }

    public function editSession(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->editSession($request);
    }

    public function getAllSession()
    {
        $SessionModel = new SessionModel();
        return $SessionModel->get();
    }
}
