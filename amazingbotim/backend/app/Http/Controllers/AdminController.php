<?php

namespace App\Http\Controllers;

use App\Model\AdminModel;
use App\Model\ControlPanelModel;
use App\Repository\ClassRepository;
use App\Service\AdminService;
use App\Repository\SubjectRepository;
use App\Repository\TeacherRepository;
use App\Repository\StudentRepository;
use App\Repository\GradeSettingsRepository;
use App\Model\SessionModel;
use App\Model\GradeSettingsModel;
use App\Model\InventoryModel;
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

    // STUDENT IMAGE
    public function uploadImage(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->uploadImage($request);
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

    //eInventory SETTINGS
    public function createGrade(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createGrade($request);
    }

    public function editGrade(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->editGrade($request);
    }

    public function getAllGrade()
    {
        $GradeSettingsModel = new GradeSettingsModel();
        return $GradeSettingsModel->get();
    }

    public function deleteGrade($grade_id)
    {
        $GradeSettingsRepository = new GradeSettingsRepository();
        return $GradeSettingsRepository->deleteGrade($grade_id);
    }


    // ATTENDANCE
    // public function takeStudentAttendance(Request $request)
    // {
    //     $AdminService = new AdminService();
    //     return $AdminService->takeStudentAttendance($request);
    // }

    // public function getStudentAttendance(Request $request)
    // {
    //     $AdminService = new AdminService();
    //     return $AdminService->getStudentAttendance($request);
    // }

    public function takeTeacherAttendance(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->takeTeacherAttendance($request);
    }

    public function getTeacherAttendance(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->getTeacherAttendance($request);
    }

    // CONTROL PANEL
    public function saveControl(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->saveControl($request);
    }


    public function getControl()
    {
     return ControlPanelModel::select("*")->get()[0];
    }


    public function getDashboardInfo()
    {
        $AdminService = new AdminService();
        return $AdminService->getDashboardInfo();
    }

    public function lessonPlan()
    {
        $AdminService = new AdminService();
        return $AdminService->lessonPlan();
    }

    // INVENTORY
    public function createInventory(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createInventory($request);
    }

    public function editInventory(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->editInventory($request);
    }

    public function getInventory()
    {
       return InventoryModel::orderBy('id','DESC')->get();
    }

    public function deleteInventory($id)
    {
        $AdminService = new AdminService();
        return $AdminService->deleteInventory($id);
    }

}
