<?php

namespace App\Service;

use App\Model\ClassModel;
use App\Model\SubjectModel;
use App\Model\StudentModel;
use App\Model\AdminModel;
use App\Model\TeacherModel;
use App\Model\TeacherAttendanceModel;
use App\Repository\ClassRepository;
use App\Repository\SubjectRepository;
use App\Repository\AdminRepository;
use App\Repository\StudentRepository;
use App\Repository\TeacherRepository;
use App\Repository\SessionRepository;
use App\Repository\GradeSettingsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminService
{
    // SIGNIN
    public function signIn(Request $request)
    {
        $AdminRepository = new AdminRepository();
        $admin = AdminModel::where('username', $request->id)->get()->first();
        if ($admin == null) {
            return  response(['success' => false, 'message' => "Invalid Admin!"]);
        } else {

            if ($AdminRepository->getPassword($request->id) == $request->password) {
                $token = $admin->createToken('token')->plainTextToken;
                return  response(['token' => $token, 'success' => true, 'message' => 'Welcome, Admin', 'data' => $admin, 'dashboard_information' => ""]);
            } else {
                return  response(['success' => false, 'message' => "Invalid Password"]);
            }
        }
    }

    // CLASS
    public function createClass(Request $request)
    {
        $ClassModel = new ClassModel();
        $ClassRepository = new ClassRepository();

        $ClassModel->class_name =  $request->class_name;
        $ClassModel->class_sector =  $request->class_sector;
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

    public function editSubject(Request $request)
    {
        $SubjectRepository = new SubjectRepository();
        return  $SubjectRepository->editSubject($request);
    }

    // STUDENT
    public function createStudent(Request $request)
    {
        $studentModel = new StudentModel();
        $studentRepository = new StudentRepository();

        $studentModel->first_name =  $request->first_name;
        $studentModel->last_name =  $request->last_name;
        $studentModel->middle_name =  $request->middle_name;
        $studentModel->gender =  $request->gender;
        $studentModel->dob =  $request->dob;
        $studentModel->religion =  $request->religion;
        $studentModel->state =  $request->state;
        $studentModel->home_address =  $request->home_address;
        $studentModel->joining_date =  $request->joining_date;
        $studentModel->class =  $request->student_class;


        $studentModel->guardian_name =  $request->guardian_name;
        $studentModel->guardian_phone =  $request->guardian_phone;
        $studentModel->guardian_email =  $request->guardian_email;
        $studentModel->guardian_address =  $request->guardian_address;


        return  $studentRepository->createStudent($studentModel);
    }

    public function editStudent($request)
    {
        $StudentRepository = new StudentRepository();
        return  $StudentRepository->editStudent($request);
    }

    public function updateStudentClass($student_id, $class_name)
    {
        $StudentRepository = new StudentRepository();
        return $StudentRepository->updateStudentClass($student_id, $class_name);
    }

    public function getAllStudent()
    {
        $StudentRepository = new StudentRepository();
        return $StudentRepository->getAllStudent();
    }

    // TEACHER
    public function createTeacher(Request $request)
    {
        $TeacherModel = new TeacherModel();
        $TeacherRepository = new TeacherRepository();

        $TeacherModel->title =  $request->title;
        $TeacherModel->first_name =  $request->first_name;
        $TeacherModel->last_name =  $request->last_name;
        $TeacherModel->middle_name = $request->middle_name == "" ? "" : $request->middle_name;
        $TeacherModel->gender =  $request->gender;
        $TeacherModel->phone =  $request->teacher_phone;
        $TeacherModel->email =  $request->teacher_email == "" ? "" : $request->teacher_email;
        $TeacherModel->dob =  $request->dob;
        $TeacherModel->religion =  $request->religion;
        $TeacherModel->joining_date =  $request->joining_date == "" ? "" : $request->joining_date;
        $TeacherModel->home_address =  $request->home_address;
        $TeacherModel->state =  $request->state;

        return  $TeacherRepository->createTeacher($TeacherModel);
    }

    public function editTeacher($request)
    {
        $TeacherRepository = new TeacherRepository();
        return  $TeacherRepository->editTeacher($request);
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

    // SESSION
    public function createSession(Request $request)
    {
        $SessionRepository = new SessionRepository();
        return $SessionRepository->createSession($request);
    }

    public function editSession(Request $request)
    {
        $SessionRepository = new SessionRepository();
        return $SessionRepository->editSession($request);
    }

    // GRADE SETTINGS
    public function createGrade(Request $request)
    {
        $GradeSettingsRepository = new GradeSettingsRepository();
        return $GradeSettingsRepository->createGrade($request);
    }

    public function editGrade(Request $request)
    {
        $GradeSettingsRepository = new GradeSettingsRepository();
        return $GradeSettingsRepository->editGrade($request);
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
        $TeacherAttendanceModel = new TeacherAttendanceModel();

        // CHECK IF ALREADY TAKEN
        $alreadytaken = DB::table('teacher_attendance')->where("teacher_id", $request->teacher_id)->where('date', $request->date)->exists();

        if ($alreadytaken) {
            return response()->json(['success' => false, 'message' => 'Attendance has already been taken.']);
        }

        $TeacherAttendanceModel->teacher_id = $request->teacher_id;
        $TeacherAttendanceModel->date = $request->date;
        $TeacherAttendanceModel->time = $request->time;
        $TeacherAttendanceModel->session = $request->session;
        $TeacherAttendanceModel->term = $request->term;
        $TeacherAttendanceModel->save();
        return response()->json(['success' => true, 'message' => 'Attendance was successfully.']);
    }
    public function getTeacherAttendance(Request $request)
    {
        $TeacherAttendanceModel =  new TeacherAttendanceModel();
        return  $TeacherAttendanceModel->with('teacher')->where('date', $request->date)->get();
    }
}
