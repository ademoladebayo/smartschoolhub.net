<?php

namespace App\Service;

use App\Model\ClassModel;
use App\Model\SubjectModel;
use App\Model\StudentModel;
use App\Model\AdminModel;
use App\Model\ControlPanelModel;
use App\Model\InventoryModel;
use App\Model\LessonPlanModel;
use App\Model\TeacherModel;
use App\Model\TeacherAttendanceModel;
use App\Model\CommunicationModel;
use App\Repository\ClassRepository;
use App\Repository\SubjectRepository;
use App\Repository\AdminRepository;
use App\Repository\StudentRepository;
use App\Repository\TeacherRepository;
use App\Repository\SessionRepository;
use App\Repository\GradeSettingsRepository;
use Faker\Guesser\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
            // REMOVE CLASS FROM PREVIOUS TEACHER
            if ($request->class_teacher != "-") {
                $this->removeClassFromTeacher($request->class_id);
            }
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



        if ($SubjectModel->class == "ALL" || $SubjectModel->class == "NURSERY SCHOOL" || $SubjectModel->class == "PRIMARY SCHOOL" || $SubjectModel->class == "JUNIOR SECONDARY SCHOOL" || $SubjectModel->class == "SENIOR SECONDARY SCHOOL") {
            // CREATE FOR ALL CLASS OR DO MULTIPLE CREATION
            return $SubjectRepository->multiCreateSubject($request);
        } else {
            if ($SubjectModel->subject_name !=  '' && $SubjectModel->class != '') {
                return  $SubjectRepository->createSubject($SubjectModel);
            } else {
                return response()->json(['success' => false, 'message' => 'Please check that no field is left empty.']);
            }
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

    // STUDENT IMAGE
    public function uploadImage(Request $request)
    {
        Log::alert($request);
        if ($request->hasFile('file')) {

            if ($request->type == "STUDENT") {
                // GET FILENAME
                $file_name = $_FILES['file']['name'];

                $storage_path =  $request->file->storeAs('public/fileupload/student', $request->id . ".png");
                return response()->json(['success' => true, 'message' => 'file uploaded', 'url' => $storage_path]);
            } else {

                // GET FILENAME
                $file_name = $_FILES['file']['name'];
                $storage_path =  $request->file->storeAs('public/fileupload/staff', $request->id . ".png");
                return response()->json(['success' => true, 'message' => 'file uploaded', 'url' => $storage_path]);
            }
        } else {
            return response()->json(['success' => false, 'message' => 'File was not uploaded.']);
        }
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

        //   USING STAFF NUMBER
        if ($request->class_id == "") {
            // CHECK IF STAFF ID EXIST
            $teacher = TeacherModel::where("teacher_id", $request->staff_id)->get();
            if (count($teacher) != 0) {

                // CHECK IF ALREADY TAKEN 
                $request->staff_id = $teacher[0]->id;
                $alreadytaken =  $this->takenAttendance($request);


                if ($alreadytaken) {
                    // CHECK OUT STAFF
                    if ($request->check_out) {
                        $TeacherAttendanceModel = TeacherAttendanceModel::where('teacher_id', $teacher[0]->id)->where('date', $request->date)->get()[0];
                        $TeacherAttendanceModel->time_out = $request->time;
                        $TeacherAttendanceModel->save();
                        return response()->json(['success' => true, 'message' => 'Check out was succesful.']);
                    }
                }


                // GET CLASS
                $TeacherAttendanceModel->teacher_id = $teacher[0]->id;
                $TeacherAttendanceModel->date = $request->date;
                $TeacherAttendanceModel->time_in = $request->time;
                $TeacherAttendanceModel->session = $request->session;
                $TeacherAttendanceModel->term = $request->term;
                $TeacherAttendanceModel->save();
                return response()->json(['success' => true, 'message' => 'Attendance was successful.']);
            } else {
                return response()->json(['success' => false, 'message' => 'Invalid Staff ID']);
            }
        }


        //   USING CARD
        // CHECK IF ALREADY TAKEN 
        $alreadytaken =  $this->takenAttendance($request);

        if ($alreadytaken) {
            // CHECK OUT STAFF
            if ($request->check_out) {
                $TeacherAttendanceModel = TeacherAttendanceModel::where('teacher_id', $request->staff_id)->where('date', $request->date)->get()[0];
                $TeacherAttendanceModel->time_out = $request->time;
                $TeacherAttendanceModel->save();
                return response()->json(['success' => true, 'message' => 'Check out was succesful.']);
            }
        }



        $TeacherAttendanceModel->teacher_id = $request->staff_id;
        $TeacherAttendanceModel->date = $request->date;
        $TeacherAttendanceModel->time_in = $request->time;
        $TeacherAttendanceModel->session = $request->session;
        $TeacherAttendanceModel->term = $request->term;
        $TeacherAttendanceModel->save();
        return response()->json(['success' => true, 'message' => 'Attendance was successful.']);




















        // $TeacherAttendanceModel = new TeacherAttendanceModel();

        // // CHECK IF ALREADY TAKEN
        // $alreadytaken = DB::table('teacher_attendance')->where("teacher_id", $request->teacher_id)->where('date', $request->date)->exists();

        // if ($alreadytaken) {
        //     return response()->json(['success' => false, 'message' => 'Attendance has already been taken.']);
        // }

        // $TeacherAttendanceModel->teacher_id = $request->teacher_id;
        // $TeacherAttendanceModel->date = $request->date;
        // $TeacherAttendanceModel->time = $request->time;
        // $TeacherAttendanceModel->session = $request->session;
        // $TeacherAttendanceModel->term = $request->term;
        // $TeacherAttendanceModel->save();
        // return response()->json(['success' => true, 'message' => 'Attendance was successfully.']);
    }

    public function takenAttendance(Request $request)
    {
        // CHECK IF ALREADY TAKEN 
        return DB::table('teacher_attendance')->where("teacher_id", $request->staff_id)->where('date', $request->date)->exists();
    }


    public function getTeacherAttendance(Request $request)
    {
        $TeacherAttendanceModel =  new TeacherAttendanceModel();
        return  $TeacherAttendanceModel->with('teacher')->where('date', $request->date)->get();
    }

    // CONTROL PANEL
    public function saveControl(Request $request)
    {
        $ControlPanelModel =  ControlPanelModel::find(1);
        $ControlPanelModel->access_result = $request->access_result;
        $ControlPanelModel->register_subject = $request->register_subject;
        $ControlPanelModel->check_debitors = $request->check_debitors;
        $ControlPanelModel->max_resumption_time = $request->max_resumption;
        $ControlPanelModel->debitor_list_last_update = explode("-", $ControlPanelModel->debitor_list_last_update)[0] . "-" . $request->update_debitor_list;
        $ControlPanelModel->save();

        return response()->json(['success' => true, 'message' => "Control Saved."]);
    }

    public function isSubjectRegistrationOpened()
    {
        $ControlPanelModel =  ControlPanelModel::find(1);
        if ($ControlPanelModel->register_subject == "YES") {
            return true;
        } else {
            return false;
        }
    }

    public function isResultAccessOpened()
    {
        $ControlPanelModel =  ControlPanelModel::find(1);
        if ($ControlPanelModel->access_result == "YES") {
            return true;
        } else {
            return false;
        }
    }

    public function isResumptionTimeCheckOpened()
    {
        $response = "";
        $ControlPanelModel =  ControlPanelModel::find(1);
        if (explode("-", $ControlPanelModel->max_resumption_time)[1] == "YES") {
            $response =  true . "-" . explode("-", $ControlPanelModel->max_resumption_time)[0];
        } else {
            $response =  false . "-" . explode("-", $ControlPanelModel->max_resumption_time)[0];
        }
        return $response;
    }

    public function isCheckDebitorsOpened()
    {
        $response = "";
        $ControlPanelModel =  ControlPanelModel::find(1);
        if (explode("-", $ControlPanelModel->check_debitors)[1] == "YES") {
            $response =  true . "-" . explode("-", $ControlPanelModel->check_debitors)[0];
        } else {
            $response =  false . "-" . explode("-", $ControlPanelModel->check_debitors)[0];
        }
        return $response;
    }


    public function getDashboardInfo()
    {
        $StudentRepository = new StudentRepository();
        $TeacherRepository = new TeacherRepository();

        return response()->json(['student_no' => $StudentRepository->allStudentCount(), 'teacher_no' => $TeacherRepository->allTeacherCount(), 'inventory' => InventoryModel::get()->count()]);
    }

    public function lessonPlan()
    {
        $term = ['FIRST TERM', 'SECOND TERM', 'THIRD TERM'];
        $week = ['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5', 'WEEK 6', 'WEEK 7', 'WEEK 8', 'WEEK 9', 'WEEK 10', 'WEEK 11', 'WEEK 12', 'WEEK 13'];


        $subjects = SubjectModel::get();
        $c = 0;
        foreach ($subjects as $subject) {
            for ($i = 0; $i < count($term); $i++) {
                for ($j = 0; $j < count($week); $j++) {
                    $LessonPlanModel = new  LessonPlanModel();
                    $LessonPlanModel->subject_id = $subject->id;
                    $LessonPlanModel->term = $term[$i];
                    $LessonPlanModel->week = $week[$j];
                    $LessonPlanModel->instructional_material = "instructional_material for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->previous_knowledge = "previous_knowledge for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->previous_lesson = "previous_lesson for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->behavioural_objective = "behavioural_objective for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->content = "content for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->presentation = "presentation for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->evaluation = "evaluation for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->conclusion = "conclusion for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->assignment = "assignment for " . $week[$j] . " " . $term[$i];
                    $LessonPlanModel->save();
                }
            }
            $c = $c + 1;
        }



        return "Lesson Note Created for " . $c . " subjects.";
    }

    public function createlessonPlan($subject_id)
    {
        $term = ['FIRST TERM', 'SECOND TERM', 'THIRD TERM'];
        $week = ['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5', 'WEEK 6', 'WEEK 7', 'WEEK 8', 'WEEK 9', 'WEEK 10', 'WEEK 11', 'WEEK 12', 'WEEK 13'];


        for ($i = 0; $i < count($term); $i++) {
            for ($j = 0; $j < count($week); $j++) {
                $LessonPlanModel = new  LessonPlanModel();
                $LessonPlanModel->subject_id = $subject_id;
                $LessonPlanModel->term = $term[$i];
                $LessonPlanModel->week = $week[$j];
                $LessonPlanModel->instructional_material = "instructional_material for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->previous_knowledge = "previous_knowledge for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->previous_lesson = "previous_lesson for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->behavioural_objective = "behavioural_objective for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->content = "content for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->presentation = "presentation for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->evaluation = "evaluation for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->conclusion = "conclusion for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->assignment = "assignment for " . $week[$j] . " " . $term[$i];
                $LessonPlanModel->save();
            }
        }
    }

    // INVENTORY
    public function createInventory(Request $request)
    {
        $InventoryModel = new InventoryModel();
        $InventoryModel->item = $request->item;
        $InventoryModel->description = $request->description;
        $InventoryModel->quantity = $request->quantity;
        $InventoryModel->date_created = $request->date_created;
        $InventoryModel->last_modified = $request->last_modified;
        $InventoryModel->save();
        return response()->json(['success' => true, 'message' => 'Item was created successfully.']);
    }

    public function editInventory(Request $request)
    {
        $InventoryModel = InventoryModel::find($request->id);
        $InventoryModel->item = $request->item;
        $InventoryModel->description = $request->description;
        $InventoryModel->quantity = $request->quantity;
        $InventoryModel->last_modified = $request->last_modified;
        $InventoryModel->save();
        return response()->json(['success' => true, 'message' => 'Item was updated successfully.']);
    }

    public function deleteInventory($id)
    {
        InventoryModel::find($id)->delete();
        return response()->json(['success' => true, 'message' => 'Item was deleted successfully.']);
    }

    // RESET ACCOUNT
    public function resetAccount(Request $request)
    {
        $StudentRepository = new StudentRepository();
        $TeacherRepository = new TeacherRepository();
        if ($request->user_type == "STUDENT") {
            $StudentRepository->updatePassword($request->id, env("DEFAULT_PASSWORD"));
        } else if ($request->user_type == "STAFF") {
            $TeacherRepository->updatePassword($request->id, Hash::make(env("DEFAULT_PASSWORD")));
        }
        return response()->json(['success' => true, 'message' => 'Account reset was successful.']);
    }


    // COMMUNICATION
    public function createMessage(Request $request)
    {
        $communication = new CommunicationModel();
        $communication->sender = $request->sender;
        $communication->sender_user_type = $request->sender_user_type;
        $communication->receiver = $request->receiver;
        $communication->receiver_user_type = $request->receiver_user_type;
        $communication->message = $request->message;
        $communication->message_type = $request->messager_type;
        $communication->receiver_seen = ",";
        $communication->date =  date("Y-m-d") . " | " . date("h:i a");
        $communication->save();
        return response()->json(['success' => true, 'message' => 'Message was successful.']);
    }

    public function editMessage(Request $request)
    {
        $communication =  CommunicationModel::find($request->id);

        if ($request->edit_type == "REPLY") {
            $communication->reply = $request->reply;
        } else {
            $communication->receiver_seen =   $communication->receiver_seen == NULL ? $request->receiver_seen . "," :   $communication->receiver_seen . "," . $request->receiver_seen;
        }
        $communication->save();
        return response()->json(['success' => true, 'message' => 'Update was successful.']);
    }

    public function getMessage($id, $type, $user_type)
    {
        if ($id == "ADMIN") {
            return $this->processMessage(CommunicationModel::orderBy('id', 'DESC')->get());
        } else {

            if ($type == "SENT") {
                return $this->processMessage(CommunicationModel::where('sender', $id)->orderBy('id', 'DESC')->get());
            } else if ($type == "RECEIVED") {
                return $this->processMessage(CommunicationModel::where('receiver', $id)->orderBy('id', 'DESC')->get());
            } else {
                return $this->processMessage(CommunicationModel::where('receiver', $id)->orWhere('sender', $id)->orderBy('id', 'DESC')->get());
            }
        }
    }


    public function processMessage($messages)
    {
        foreach ($messages as $message) {
            // SENDER 
            if ($message->sender_user_type == "STUDENT") {
                $student = StudentModel::find($message->sender);
                $message->sender = "PARENT (" . $student->first_name . " " . $student->last_name . ")";
            } else if ($message->sender_user_type == "TEACHER") {
                $teacher = TeacherModel::find($message->sender);
                $message->sender = "TEACHER (" . $teacher->first_name . " " . $teacher->last_name . ")";
            } else if ($message->sender_user_type == "STUDENT" && $message->receiver_user_type == "TEACHER") {
                $teacher = TeacherModel::find($message->sender);
                $message->sender = "CLASS TEACHER (" . $teacher->first_name . " " . $teacher->last_name . ")";
            } else {
                $message->sender = "SCHOOL ADMIN";
            }


            // RECEIVER 
            if ($message->receiver_user_type == "STUDENT") {
                $student = StudentModel::find($message->receiver);
                $message->receiver = "PARENT (" . $student->first_name . " " . $student->last_name . ")";
            } else if ($message->receiver_user_type == "TEACHER") {
                $teacher = TeacherModel::find($message->receiver);
                $message->receiver = "TEACHER (" . $teacher->first_name . " " . $teacher->last_name . ")";
            } else if ($message->sender_user_type == "TEACHER" && $message->receiver_user_type == "STUDENT") {
                $teacher = TeacherModel::find($message->receiver);
                $message->receiver = "CLASS TEACHER (" . $teacher->first_name . " " . $teacher->last_name . ")";
            } else {
                $message->receiver = "SCHOOL ADMIN";
            }
        }

        return response()->json(['success' => true, 'messages' => $messages]);
    }
}
