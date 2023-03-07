<?php

namespace App\Service;

use App\Model\StudentModel;
use App\Model\CBTModel;
use App\Model\CBTResultModel;
use App\Model\GradeSettingsModel;
use App\Model\SessionModel;
use App\Model\StudentResultCommentModel;
use App\Model\StudentResultRatingModel;
use App\Model\SubjectRegistrationModel;
use App\Model\SubjectModel;
use App\Model\LiveClassModel;
use App\Model\TeacherModel;
use App\Model\LessonPlanModel;
use App\Model\NoteModel;
use App\Model\AssignmentModel;
use App\Model\AssignmentSubmissionModel;
use App\Model\UploadModel;
use App\Repository\GradeSettingsRepository;
use App\Repository\TeacherRepository;
use App\Repository\SubjectRepository;
use App\Repository\StudentRepository;
use App\Util\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class TeacherService
{


    // SIGNIN
    public function signIn(Request $request)
    {
        $TeacherRepository = new TeacherRepository();
        $teacher = TeacherModel::where('teacher_id', $request->id)->with('assigned_class')->get()->first();
        if ($teacher == null) {
            return  response(['success' => false, 'message' => "Invalid Teacher!"]);
        } else {

            if (Hash::check($request->password, $TeacherRepository->getPassword($request->id))) {

                // Check if account is disabled
                if ($teacher->profile_status == "DISABLED") {
                    return  response(['success' => false, 'message' => "😔Your account has been disabled, contact the school admin."]);
                }

                $token = $teacher->createToken('token')->plainTextToken;
                // $cookie = cookie('jwt', $token, 1);
                $cookie = Cookie::make('jwt', $token, 1);
                return  response(['token' => $token, 'success' => true, 'message' => 'Welcome, ' . $teacher->first_name, 'data' => $teacher, 'dashboard_information' => $this->getDashBoardInformation($teacher)])->withCookie($cookie);
            } else {
                return  response(['success' => false, 'message' => "Invalid Password"]);
            }
        }
    }

    public function getDashBoardInformation($teacher)
    {
        $SubjectRepository = new SubjectRepository();
        $StudentRepository = new StudentRepository();
        $util = new Utils();
        $CBTModel = CBTModel::whereIn('subject_id', SubjectModel::select('id')->where('teacher', $teacher->id)->get())->Where('session', $util->getCurrentSession()[0])->Where('term', $util->getCurrentSession()[1])->get();

        $cbt_subject_count = [];
        $subject_ids = [];

        foreach (SubjectModel::select('id')->where('teacher', $teacher->id)->get() as $subject) {
            array_push($subject_ids, $subject->id);
        };

        foreach ($subject_ids as $id) {
            $cbt = CBTModel::where('subject_id', $id)->Where('session', $util->getCurrentSession()[0])->Where('term', $util->getCurrentSession()[1])->get();
            array_push($cbt_subject_count, count($cbt));
        }

        $cbt = ['cbt_no' =>  count($CBTModel), 'cbt_subject_id' =>  $subject_ids, 'cbt_subject_count' => $cbt_subject_count];

        // NUMBER OF STUDENT IN MY CLASS
        // NUMBER OF SUBJECT I TAKE
        if ($teacher->assigned_class == '-') {
            return ['no_of_assigned_subject' => $SubjectRepository->getNoOfAssignedSubject($teacher->id), 'no_of_student' => "No class assigned", 'male' => 0, 'female' => 0, 'events' => null, "notification" => null, "cbt" => $cbt];
        }

        return ['no_of_assigned_subject' => $SubjectRepository->getNoOfAssignedSubject($teacher->id), 'no_of_student' => $StudentRepository->getNoOfClassStudent($teacher->assigned_class)[0], 'male' =>  $StudentRepository->getNoOfClassStudent($teacher->assigned_class)[1], 'female' =>  $StudentRepository->getNoOfClassStudent($teacher->assigned_class)[2], 'events' => null, "notification" => null, "cbt" => $cbt];
    }

    // SUBJECT REGISTRATION
    public function registerSubject(Request $request)
    {
        // GET ID OF ALL STUDENT IN THE CLASS
        $students_id = [];
        foreach (StudentModel::select('id')->where('class', $request->class)->get() as $data) {
            array_push($students_id, $data->id);
        }
        Log::debug("STUDENTS ID : ");
        Log::debug($students_id);
        Log::debug("                              ");
        Log::debug("                              ");
        // LOOP THROUGH EACH STUDENT
        for ($i = 0; $i < count($students_id); $i++) {
            Log::debug("=========================================================");
            Log::debug("REGISTRATION FOR STUDENT " . ($i + 1));
            Log::debug("=========================================================");
            $StudentResultCommentModel = new StudentResultCommentModel();
            $StudentResultRatingModel = new StudentResultRatingModel();

            // GET PREVIOUS REGISTRATION FOR EACH STUDENT
            $previous_registration_id = [];
            foreach (SubjectRegistrationModel::select("subject_id")->where('student_id', $students_id[$i])->where('class_id', $request->class)->Where('subject_type', 'COMPULSORY')->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
                array_push($previous_registration_id, $data->subject_id);
            }
            Log::debug("PREVIOUS REGISTRATION : ");
            Log::debug($previous_registration_id);

            // GET THE DIFFRENCE BETWEEN THE PREVIOUS AND NEW REGISTRATION
            $subject_to_register = [];
            $subject_to_delete = [];

            // NEW SUBJECT TO REGISTER
            $diffrence = array_diff($request->subject_to_register, $previous_registration_id);
            foreach ($diffrence as $diff) {
                array_push($subject_to_register, $diff);
            }

            // SUBJECT TO DELETE
            $diffrence = array_diff($previous_registration_id, $request->subject_to_register);

            foreach ($diffrence as $diff) {
                array_push($subject_to_delete, $diff);
            }
            // DELETE SUBJECTS
            foreach ($subject_to_delete as $subject) {
                SubjectRegistrationModel::where('student_id', $students_id[$i])->where('class_id', $request->class)->where('subject_id', $subject)->Where('subject_type', 'COMPULSORY')->Where('session', $request->session)->Where('term', $request->term)->delete();
            }


            Log::debug("SUBJECT TO REGISTER");
            Log::debug($subject_to_register);
            Log::debug("SUBJECT TO DELETE");
            Log::debug($subject_to_delete);



            for ($j = 0; $j < count($subject_to_register); $j++) {
                $SubjectRegistrationModel = new SubjectRegistrationModel();
                $SubjectRegistrationModel->subject_id = $subject_to_register[$j];
                $SubjectRegistrationModel->student_id = $students_id[$i];
                $SubjectRegistrationModel->subject_type = "COMPULSORY";
                $SubjectRegistrationModel->class_id = $request->class;
                $SubjectRegistrationModel->session =  $request->session;
                $SubjectRegistrationModel->term = $request->term;
                $SubjectRegistrationModel->save();
            }

            Log::alert(StudentResultCommentModel::where('student_id', $students_id[$i])->where('session', $request->session)->where('term', $request->term)->exists());
            // CHECK IF IT HAS BEEN CREATED FOR CURRENT STUDENT
            if (!StudentResultCommentModel::where('student_id', $students_id[$i])->where('session', $request->session)->where('term', $request->term)->exists()) {

                // COMMENT
                $StudentResultCommentModel->student_id = $students_id[$i];
                $StudentResultCommentModel->session =  $request->session;
                $StudentResultCommentModel->term = $request->term;
                $StudentResultCommentModel->save();

                // RATINGS 
                $StudentResultRatingModel->student_id = $students_id[$i];
                $StudentResultRatingModel->session =  $request->session;
                $StudentResultRatingModel->term = $request->term;
                $StudentResultRatingModel->save();
            }
        }

        return  response(['success' => true, 'message' => "Registration was successful for " . count($students_id) . " Students"]);;
    }


    public function getRegisteredSubject(Request $request)
    {
        $previous_registration_id = [];
        if ($request->both_elective_and_compulsory) {
            foreach (SubjectRegistrationModel::select("subject_id")->where('class_id', $request->class)->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
                array_push($previous_registration_id, $data->subject_id);
            }
            return  $previous_registration_id;
        }

        foreach (SubjectRegistrationModel::select("subject_id")->where('class_id', $request->class)->Where('subject_type', 'COMPULSORY')->Where('session', $request->session)->Where('term', $request->term)->get() as $data) {
            array_push($previous_registration_id, $data->subject_id);
        }
        return  $previous_registration_id;
    }

    public function getAssignedSubject(Request $request)
    {
        return SubjectModel::where("teacher", $request->teacher_id)->with('class')->get();
    }

    // CBT

    public function createCBT(Request $request)
    {
        $CBTModel = new CBTModel();
        $CBTModel->cbt_title = $request->cbt_title;
        $CBTModel->cbt_date = $request->cbt_date;
        $CBTModel->start_time = $request->start_time;
        $CBTModel->cbt_duration = $request->cbt_duration;
        $CBTModel->cbt_instruction = $request->cbt_instruction;
        $CBTModel->cbt_question = $request->cbt_question;
        $CBTModel->cbt_options = $request->cbt_options;
        $CBTModel->cbt_answer = $request->cbt_answer;
        $CBTModel->cbt_questions_number = $request->cbt_questions_number;
        $CBTModel->subject_id = $request->subject_id;
        $CBTModel->class_id = $request->class_id;
        $CBTModel->session = $request->session;
        $CBTModel->term = $request->term;
        $CBTModel->save();

        return  response(['success' => true, 'message' => "CBT was created successfully"]);
    }

    public function editCBT(Request $request)
    {
        $CBTModel = CBTModel::find($request->cbt_id);

        $CBTModel->cbt_title = $request->cbt_title;
        $CBTModel->cbt_date = $request->cbt_date;
        $CBTModel->start_time = $request->start_time;
        $CBTModel->cbt_duration = $request->cbt_duration;
        $CBTModel->cbt_instruction = $request->cbt_instruction;
        $CBTModel->cbt_question = $request->cbt_question;
        $CBTModel->cbt_options = $request->cbt_options;
        $CBTModel->cbt_answer = $request->cbt_answer;
        $CBTModel->cbt_questions_number = $request->cbt_questions_number;
        $CBTModel->subject_id = $request->subject_id;
        $CBTModel->class_id = $request->class_id;
        $CBTModel->session = $request->session;
        $CBTModel->term = $request->term;
        $CBTModel->save();
        return  response(['success' => true, 'message' => "CBT Update was successful"]);
    }

    public function allCBT(Request $request)
    {
        return CBTModel::where("subject_id", $request->subject_id)->where("session", $request->session)->where("term", $request->term)->with('class', 'subject')->get();
    }

    public function deleteCBT($cbt_id)
    {
        $cbt = CBTModel::find($cbt_id);
        $cbt->delete();
        return response()->json(['success' => true, 'message' => 'CBT was deleted successfully.']);
    }

    public function changeCBTStatus($cbt_id, $status)
    {

        $cbt = CBTModel::find($cbt_id);
        $cbt->cbt_status = $status;
        $cbt->save();
        return response()->json(['success' => true, 'message' => 'CBT was ' . $status . ' successfully.']);
    }

    public function getCBTResult($cbt_id)
    {
        return CBTResultModel::where("cbt_id", $cbt_id)->with("student")->get();
    }

    public function useCBTResultFor($cbt_id, $use_result_for, $subject_id)
    {
        // GET CURRENT SESSION AND TERM
        $session =  SessionModel::select('session', 'term')->where('session_status', 'CURRENT')->get()[0]->session;
        $term =  SessionModel::select('session', 'term')->where('session_status', 'CURRENT')->get()[0]->term;


        $cbt_result = CBTResultModel::select('student_id', 'score',)->where('cbt_id', $cbt_id)->get();
        foreach ($cbt_result as $data) {
            // GET EACH DATA AND UPDATE THE STUDENT RESULT
            SubjectRegistrationModel::where('student_id', $data->student_id)->where('subject_id', $subject_id)->where('session', $session)->where('term', $term)->update(array($use_result_for => $data->score));
        }

        return response()->json(['success' => true, 'message' => 'Process was successful']);
    }


    // RESULT UPLOAD
    public function getStudentRegistered(Request $request)
    {
        $result =  SubjectRegistrationModel::select('id', 'student_id', 'first_ca', 'second_ca', 'examination', DB::raw('(first_ca + second_ca + examination) as total'))->where("subject_id", $request->subject_id)->where("session", $request->session)->where("term", $request->term)->with('student')->get();
        // LOOP THROUGH RESULT AND ATTACH GRADE

        foreach ($result as $data) {
            // TAKE EACH TOTAL SCORE AND GET GRADE AND REMARK
            $GradeSettingsRepository  = new GradeSettingsRepository();
            $gradeAndRemark =  $GradeSettingsRepository->getGradeAndRemark($data->total);
            $data['grade'] = count($gradeAndRemark) != 0 ? $gradeAndRemark[0]->grade : '--';
            $data['remark'] = count($gradeAndRemark) != 0 ? $gradeAndRemark[0]->remark : '--';
        }
        $avg =  SubjectRegistrationModel::select(DB::raw('avg(total) as avg'))->where("subject_id", $request->subject_id)->where("session", $request->session)->where("term", $request->term)->get()[0]->avg;
        $min =  SubjectRegistrationModel::select(DB::raw('min(total) as min'))->where("subject_id", $request->subject_id)->where("session", $request->session)->where("term", $request->term)->get()[0]->min;
        $max =  SubjectRegistrationModel::select(DB::raw('max(total) as max'))->where("subject_id", $request->subject_id)->where("session", $request->session)->where("term", $request->term)->get()[0]->max;

        return response()->json(['result' => $result, 'avg' => $avg, 'min' => $min, 'max' => $max]);
    }

    public function uploadResult(Request $request)
    {
        $result = SubjectRegistrationModel::find($request->id);

        if ($request->result_type == "first_ca") {
            $result->first_ca = $request->score;
        } else if ($request->result_type == "second_ca") {
            $result->second_ca = $request->score;
        } else if ($request->result_type == "examination") {
            $result->examination = $request->score;
        } else if ($request->result_type == "grade") {
            $result->grade = $request->score;
        } else if ($request->result_type == "remark") {
            $result->remark = $request->score;
        }

        $first_ca = $result->first_ca != "-" ? $result->first_ca : 0;
        $second_ca = $result->second_ca != "-" ? $result->second_ca : 0;
        $examination = $result->examination != "-" ? $result->examination : 0;


        $result->total =  $first_ca +  $second_ca +  $examination;
        $result->save();
        return response()->json(['success' => true, 'message' => 'Result updated']);
    }

    public function uploadResultBulk(Request $request)
    {
        $data = request()->all();
        foreach ($data as $keys => $value) {
            $result = SubjectRegistrationModel::find($keys);
            foreach ($data[$keys] as $key => $value) {
                $result[$key] = $value == null ? "-" : $value;
            }

            $first_ca = $result->first_ca != "-" ? $result->first_ca : 0;
            $second_ca = $result->second_ca != "-" ? $result->second_ca : 0;
            $examination = $result->examination != "-" ? $result->examination : 0;


            $result->total =  $first_ca +  $second_ca +  $examination;
            $result->save();
        }
        return response()->json(['success' => true, 'message' => 'Result upload was successful.']);
    }


    public function uploadCommentAndRating(Request $request)
    {
        if ($request->type == "COMMENT") {
            StudentResultCommentModel::where('student_id', $request->student_id)->where("session", $request->session)->where("term", $request->term)->update(array('class_teacher_comment' => $request->value));
            return response()->json(['success' => true, 'message' => 'Result updated']);
        } else {
            StudentResultRatingModel::where('student_id', $request->student_id)->where("session", $request->session)->where("term", $request->term)->update(array($request->rating_type => $request->value));
            return response()->json(['success' => true, 'message' => 'Result updated']);
        }
    }

    // ATTENDANCE
    public function takeAttendance(Request $request)
    {
    }

    // PROMOTE STUDENT
    public function promoteStudents(Request $request)
    {
        $session_term = SessionModel::where("session_status", "CURRENT")->get();
        foreach (StudentModel::where('class', $request->old_class)->get() as $student) {
            $student->class = $request->new_class;

            if ($request->new_class == "GRADUATED") {
                $student->graduation = $request->old_class . "_" . $session_term[0]->session . "_" . $session_term[0]->term;
            }
            $student->save();
        }
        // StudentModel::where('class', $request->old_class)->update(['class' => $request->new_class]);
        // DB::table('student')->where('class', $request->old_class)->update(['class' => $request->new_class]);
        //DB::select("update student set class =" . $request->new_class . " where class =" . $request->old_class);
        return response()->json(['success' => true, 'message' => 'Students have been promoted successfully.']);
    }



    // CHANGE PASSWORD
    public function changePassword(Request $request)
    {
        $TeacherRepository = new TeacherRepository();
        // CHECK IF PREVIOUS PASSWORD IS CORRECT
        $previous_password =  $TeacherRepository->getPassword($request->teacher_id);
        if (!Hash::check($request->current_password, $previous_password)) {
            return response()->json(['success' => false, 'message' => 'Current password is incorrect!']);
        } else {
            $TeacherRepository->updatePassword($request->teacher_id, Hash::make($request->new_password));
            return response()->json(['success' => true, 'message' => 'Password has been changed successfully.']);
        }
    }

    // LESSON NOTE
    public function lessonPlan(Request $request)
    {
        if ($request->user_type == "ADMIN") {

            if ($request->status == "ALL") {
                $lessons =  LessonPlanModel::where('subject_id', $request->subject_id)->where('term', $request->term)->with('subject')->get();
                foreach ($lessons as $lesson) {
                    $teacher = TeacherModel::find($lesson->subject->teacher);
                    $lesson["teacher"] = $teacher->title . " " . $teacher->first_name . " " . $teacher->last_name;
                }
            } else {
                $lessons =  LessonPlanModel::where('subject_id', $request->subject_id)->where('term', $request->term)->where('status', $request->status)->with('subject')->get();
                foreach ($lessons as $lesson) {
                    $teacher = TeacherModel::find($lesson->subject->teacher);
                    $lesson["teacher"] = $teacher->title . " " . $teacher->first_name . " " . $teacher->last_name;
                }
            }

            return $lessons;
        } else {
            return LessonPlanModel::where('subject_id', $request->subject_id)->where('term', $request->term)->where('week', $request->week)->get()[0];
        }
    }

    public function savelessonPlan(Request $request)
    {
        $LessonPlanModel = LessonPlanModel::find($request->id);
        if ($request->user_type == "ADMIN") {
            $LessonPlanModel->status = $request->status . "D";
        } else {
            $LessonPlanModel->week = $request->week;
            $LessonPlanModel->instructional_material = $request->instructional_material;
            $LessonPlanModel->previous_knowledge = $request->previous_knowledge;
            $LessonPlanModel->previous_lesson = $request->previous_lesson;
            $LessonPlanModel->behavioural_objective = $request->behavioural_objective;
            $LessonPlanModel->content = $request->content;
            $LessonPlanModel->presentation = $request->presentation;
            $LessonPlanModel->evaluation = $request->evaluation;
            $LessonPlanModel->conclusion = $request->conclusion;
            $LessonPlanModel->assignment = $request->assignment;
            $LessonPlanModel->status = "IN-REVIEW";
        }
        $LessonPlanModel->save();
        return response()->json(['success' => true, 'message' => 'Lesson plan has been saved.']);
    }

    // LEARNING HUB
    public function postSubjectMaterial(Request $request)
    {
        Log::alert($request);
        if ($request->material_type == "NOTE") {
            // CREATE NEW NOTE
            $note = new NoteModel();
            $note->subject_id = $request->subject_id;
            $note->content = $request->content;
            $note->topic = $request->topic;
            $note->date = date("Y-m-d") . " | " . date("h:i a");
            $note->save();
        } else if ($request->material_type == "ASSIGNMENT") {
            // CREATE NEW ASSIGNMENT
            $assignment = new AssignmentModel();
            $util = new Utils();

            $assignment->subject_id = $request->subject_id;
            $assignment->content = $request->content;
            $assignment->topic = $request->topic;
            $assignment->status = "OPEN";
            $assignment->date = date("Y-m-d") . " | " . date("h:i a");
            $assignment->mark_obtainable = $request->mark_obtainable;
            $assignment->session = $util->getCurrentSession()[0];
            $assignment->term =  $util->getCurrentSession()[1];
            $assignment->save();
        } else if ($request->material_type == "UPLOAD" || $request->material_type == "VIDEO") {
            // NEW UPLOAD OR VIDEO
            $upload = new UploadModel();
            if ($request->material_type == "UPLOAD") {
                // GET FILENAME
                $file_name = $_FILES['file']['name'];
                $request->file->storeAs('public/fileupload/learninghub', $file_name);
            } else {
                $file_name = $request->content;
                if (str_contains($file_name, "watch?v=")) {
                    $file_name =  str_replace("watch?v=", "embed/", $file_name);
                }

                if (str_contains($file_name, "youtu.be")) {
                    $file_name =  str_replace("youtu.be", "youtube.com/embed", $file_name);
                }
            }

            $upload->subject_id = $request->subject_id;
            $upload->upload_type = $request->material_type;
            $upload->url = $file_name;
            $upload->date = date("Y-m-d") . " | " . date("h:i a");
            $upload->save();
        }



        return response()->json(['success' => true, 'message' => 'Upload was successful.']);
    }

    public function editSubjectMaterial(Request $request)
    {
        if ($request->material_type == "NOTE") {
            // CREATE NEW NOTE
            $note = NoteModel::find($request->material_id);
            $note->subject_id = $request->subject_id;
            $note->content = $request->content;
            $note->topic = $request->topic;
            // $note->date = date("Y-m-d") . " | " . date("h:i a");
            $note->save();
        } else if ($request->material_type == "ASSIGNMENT") {
            // CREATE NEW ASSIGNMENT

            if (str_contains($request->material_id, 'STATUS')) {
                $assignment =  AssignmentModel::find(explode('-', $request->material_id)[0]);
                $assignment->status = $assignment->status == "OPEN" ? "CLOSE" : "OPEN";
                $assignment->save();
            } else {
                $assignment =  AssignmentModel::find($request->material_id);
                $assignment->subject_id = $request->subject_id;
                $assignment->content = $request->content;
                $assignment->mark_obtainable = $request->mark_obtainable;
                $assignment->topic = $request->topic;
                $assignment->date = date("Y-m-d") . " | " . date("h:i a");
                $assignment->save();
            }
        }

        return response()->json(['success' => true, 'message' => 'Update was successful.']);
    }

    public function deleteSubjectMaterial(Request $request)
    {
        if ($request->material_type == "NOTE") {
            $note = NoteModel::find($request->material_id);
            $note->delete();
        } else if ($request->material_type == "ASSIGNMENT") {
            $assignment =  AssignmentModel::find($request->material_id);
            $assignment->delete();
        } else if ($request->material_type == "UPLOAD" || $request->material_type == "VIDEO") {
            $upload = UploadModel::find($request->material_id);
            $upload->delete();

            // DELETE ACTUAL FILE
        }

        return response()->json(['success' => true, 'message' => 'Deletion was successful.']);
    }

    public function getSubjectMaterial($subject_id)
    {
        $note = NoteModel::Where('subject_id', $subject_id)->orderBy('id', 'DESC')->get();

        $upload = UploadModel::Where('subject_id', $subject_id)->where('upload_type', 'UPLOAD')->orderBy('id', 'DESC')->get();

        $video = UploadModel::Where('subject_id', $subject_id)->where('upload_type', 'VIDEO')->orderBy('id', 'DESC')->get();

        $util = new Utils();
        $assignment = AssignmentModel::Where('subject_id', $subject_id)->where('session', $util->getCurrentSession()[0])->where('term', $util->getCurrentSession()[1])->orderBy('id', 'DESC')->get();

        return response()->json(['note' => $note, 'upload' => $upload, 'video' => $video, 'assignment' => $assignment]);
    }


    // ASSIGNMENT SUBMISSION
    public function postSubmission(Request $request)
    {
        $assignmentSubmission = new AssignmentSubmissionModel();

        if (AssignmentSubmissionModel::where('student_id', $request->student_id)->where('assignment_id', $request->assignment_id)->exists()) {
            return response()->json(['success' => false, 'message' => 'You have submitted this assignment.']);
        }

        $assignmentSubmission->assignment_id = $request->assignment_id;
        $assignmentSubmission->student_id = $request->student_id;
        $assignmentSubmission->content = $request->content;
        $assignmentSubmission->date = date("Y-m-d") . " | " . date("h:i a");
        $assignmentSubmission->save();

        return response()->json(['success' => true, 'message' => 'Submission was successful.']);
    }

    public function editSubmission(Request $request)
    {
        $assignmentSubmission = AssignmentSubmissionModel::find($request->submission_id);
        $assignmentSubmission->score = $request->score;
        $assignmentSubmission->graded = "TRUE";
        $assignmentSubmission->save();
        return response()->json(['success' => true, 'message' => 'Assignment was graded successfully']);
    }

    public function getSubmission($assignment_id)
    {
        $submission = AssignmentSubmissionModel::where('assignment_id', $assignment_id)->orderBy('id', 'DESC')->get();
        foreach ($submission as $sub) {
            $student =  StudentModel::find($sub->student_id);
            $sub->student_name = $student->first_name . " " . $student->last_name . " (" . $student->student_id . ")";
        }
        return response()->json(['submission' => $submission]);
    }


    // LIVE CLASS
    public function scheduleLiveClass(Request $request)
    {
        $liveClassModel = new LiveClassModel();
        $liveClassModel->topic = $request->topic;
        $liveClassModel->date = $request->date;
        $liveClassModel->time = $request->time;
        $liveClassModel->subject_id = $request->subject_id;
        // GET CLASS ID WITH SUBJECT ID
        $subjectModel = SubjectModel::find($request->subject_id);
        $liveClassModel->class_id = $subjectModel->class;

        $util = new Utils();
        $liveClassModel->session = $util->getCurrentSession()[0];
        $liveClassModel->term = $util->getCurrentSession()[1];

        $school_name = Explode(" ", DB::table("school_details")->get()[0]->school_name)[0];
        $liveClassModel->live_id = "SSHUBNET" . $liveClassModel->subject_id . $liveClassModel->class_id . date("Ymd") . date("hiA") . $school_name;
        $liveClassModel->save();
        return response()->json(['success' => true, 'message' => 'Live class was scheduled successfully.']);
    }

    public function editScheduledLiveClass(Request $request)
    {
        $liveClassModel = LiveClassModel::find($request->live_id);
        if ($request->topic == 'LIVE') {
            $liveClassModel->status = 'LIVE';
            $liveClassModel->save();
            return response()->json(['success' => true, 'message' => 'Class is now live.']);
        } else {
            $liveClassModel->topic = $request->topic;
            $liveClassModel->date = $request->date;
            $liveClassModel->time = $request->time;
            $liveClassModel->save();
            return response()->json(['success' => true, 'message' => 'Live class was updated successfully.']);
        }
    }

    public function getLiveClass($subject_id)
    {
        $util = new Utils();
        return LiveClassModel::where('subject_id', $subject_id)->where('session', $util->getCurrentSession()[0])->where('term', $util->getCurrentSession()[1])->orderBy('id', 'DESC')->get();
    }

    public function deleteLiveClass($id)
    {
        $liveClassModel = LiveClassModel::find($id);
        $liveClassModel->delete();
        return response()->json(['success' => true, 'message' => 'Live class was deleted successfully.']);
    }
}
