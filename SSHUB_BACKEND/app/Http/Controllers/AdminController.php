<?php

namespace App\Http\Controllers;

use App\Repository\ClassRepository;
use App\Service\AdminService;
use App\Repository\SubjectRepository;
use Illuminate\Http\Request;

class AdminController extends Controller
{
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

    // STUDENT
    public function createStudent(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createStudent($request);
    }

    // TEACHER
    public function createTeacher(Request $request)
    {
        $AdminService = new AdminService();
        return $AdminService->createTeacher($request);
    }

    public function getAllTeacher()
    {
        $AdminService = new AdminService();
        return $AdminService->getAllTeacher();
    }
}
