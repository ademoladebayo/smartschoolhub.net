<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Cors;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});





// =============================================================================
//               BEGINNING OF ADMIN ROUTE
// =============================================================================
// ADMIN {SIGNIN}
Route::post('admin/signin', 'AdminController@signIn', function () {
})->middleware(Cors::class);

Route::get('test/all-class', 'AdminController@getAllClass', function () {
})->middleware(Cors::class);

Route::get('admin/create-lesson-note', 'AdminController@lessonPlan', function () {
})->middleware(Cors::class);

Route::middleware('auth:sanctum')->group(function () {
    // ADMIN {CLASS}
    Route::post('admin/create-class', 'AdminController@createClass', function () {
    })->middleware(Cors::class);

    Route::post('admin/edit-class', 'AdminController@editClass', function () {
    })->middleware(Cors::class);

    Route::get('admin/delete-class/{class_id}', 'AdminController@deleteClass', function () {
    })->middleware(Cors::class);

    Route::get('admin/all-class', 'AdminController@getAllClass', function () {
    })->middleware(Cors::class);

    Route::get('admin/search-class/{class_name}', 'AdminController@searchClass', function () {
    })->middleware(Cors::class);

    // ADMIN {SUBJECT}
    Route::post('admin/create-subject', 'AdminController@createSubject', function () {
    })->middleware(Cors::class);

    Route::get('admin/all-subject', 'AdminController@getAllSubject', function () {
    })->middleware(Cors::class);

    Route::post('admin/edit-subject', 'AdminController@editSubject', function () {
    })->middleware(Cors::class);

    Route::get('admin/delete-subject/{subject_id}', 'AdminController@deleteSubject', function () {
    })->middleware(Cors::class);

    Route::get('admin/search-subject/{subject_name}', 'AdminController@searchSubject', function () {
    })->middleware(Cors::class);

    // ADMIN {STUDENT}
    Route::post('admin/create-student', 'AdminController@createStudent', function () {
    })->middleware(Cors::class);

    Route::post('admin/edit-student', 'AdminController@editStudent', function () {
    })->middleware(Cors::class);

    Route::get('admin/all-student', 'AdminController@getAllStudent', function () {
    })->middleware(Cors::class);

    Route::get('admin/delete-student/{student_id}', 'AdminController@deleteStudent', function () {
    })->middleware(Cors::class);

    Route::get('admin/update-student-profilestatus/{id}', 'AdminController@updateStudentProfileStatus', function () {
    })->middleware(Cors::class);

    Route::get('admin/search-student/{search_data}', 'AdminController@searchStudent', function () {
    })->middleware(Cors::class);

    //  STUDENT IMAGE
    Route::post('admin/upload-image', 'AdminController@uploadImage', function () {
    })->middleware(Cors::class);




    // ADMIN {TEACHER}
    Route::post('admin/create-teacher', 'AdminController@createTeacher', function () {
    })->middleware(Cors::class);

    Route::post('admin/edit-teacher', 'AdminController@editTeacher', function () {
    })->middleware(Cors::class);

    Route::get('admin/all-teacher', 'AdminController@getAllTeacher', function () {
    })->middleware(Cors::class);

    Route::get('admin/delete-teacher/{teacher_id}', 'AdminController@deleteTeacher', function () {
    })->middleware(Cors::class);

    Route::get('admin/update-teacher-profilestatus/{id}', 'AdminController@updateTeacherProfileStatus', function () {
    })->middleware(Cors::class);

    Route::get('admin/search-teacher/{search_data}', 'AdminController@searchTeacher', function () {
    })->middleware(Cors::class);


    // ADMIN {SESSION MANAGEMENT}
    Route::post('admin/create-session', 'AdminController@createSession', function () {
    })->middleware(Cors::class);

    Route::post('admin/edit-session', 'AdminController@editSession', function () {
    })->middleware(Cors::class);

    Route::get('admin/all-session', 'AdminController@getAllSession', function () {
    })->middleware(Cors::class);

    // ADMIN {GRADING SYSTEM}
    Route::post('admin/create-grade', 'AdminController@createGrade', function () {
    })->middleware(Cors::class);

    Route::post('admin/edit-grade', 'AdminController@editGrade', function () {
    })->middleware(Cors::class);

    Route::get('admin/all-grade', 'AdminController@getAllGrade', function () {
    })->middleware(Cors::class);

    Route::get('admin/delete-grade/{grade_id}', 'AdminController@deleteGrade', function () {
    })->middleware(Cors::class);

    // ADMIN {ATTENDANCE}
    // Route::post('admin/take-student-attendance', 'AdminController@takeStudentAttendance', function () {
    // })->middleware(Cors::class);

    // Route::post('admin/get-student-attendance', 'AdminController@getStudentAttendance', function () {
    // })->middleware(Cors::class);

    Route::post('admin/take-teacher-attendance', 'AdminController@takeTeacherAttendance', function () {
    })->middleware(Cors::class);

    Route::post('admin/get-teacher-attendance', 'AdminController@getTeacherAttendance', function () {
    })->middleware(Cors::class);

    // ADMIN {DASHBOARD INFO}
    Route::get('admin/dashboard-information', 'AdminController@getDashboardInfo', function () {
    })->middleware(Cors::class);

    // ADMIN {CONTROL PANEL}
    Route::post('admin/control-panel', 'AdminController@saveControl', function () {
    })->middleware(Cors::class);

    // ADMIN {DASHBOARD INFO}
    Route::get('admin/control-panel', 'AdminController@getControl', function () {
    })->middleware(Cors::class);


    // ADMIN {INVENTORY SYSTEM}
    Route::post('admin/inventory', 'AdminController@createInventory', function () {
    })->middleware(Cors::class);

    Route::get('admin/inventory', 'AdminController@getInventory', function () {
    })->middleware(Cors::class);

    Route::put('admin/inventory', 'AdminController@editInventory', function () {
    })->middleware(Cors::class);

    Route::delete('admin/inventory/{id}', 'AdminController@deleteInventory', function () {
    })->middleware(Cors::class);


    // =============================================================================
    //               END OF ADMIN ROUTE
    // =============================================================================

});

// =============================================================================
//               BEGINNING OF TEACHER ROUTE
// =============================================================================
// TEACHER {SIGNIN}
Route::post('teacher/signin', 'TeacherController@signIn', function () {
})->middleware(Cors::class);

Route::middleware('auth:sanctum')->group(function () {
    // TEACHER {SUBJECT}
    Route::post('teacher/register-subject', 'TeacherController@registerSubject', function () {
    })->middleware(Cors::class);

    Route::post('teacher/registered-subject', 'TeacherController@getRegisteredSubject', function () {
    })->middleware(Cors::class);

    Route::post('teacher/assigned-subject', 'TeacherController@getAssignedSubject', function () {
    })->middleware(Cors::class);

    // TEACHER {CBT}
    Route::post('teacher/create-cbt', 'TeacherController@createCBT', function () {
    })->middleware(Cors::class);

    Route::post('teacher/edit-cbt', 'TeacherController@editCBT', function () {
    })->middleware(Cors::class);

    Route::post('teacher/all-cbt', 'TeacherController@allCBT', function () {
    })->middleware(Cors::class);

    Route::get('teacher/delete-cbt/{cbt_id}', 'TeacherController@deleteCBT', function () {
    })->middleware(Cors::class);

    Route::get('teacher/cbt-change-status/{cbt_id}/{status}', 'TeacherController@changeCBTStatus', function () {
    })->middleware(Cors::class);

    Route::get('teacher/cbt-result/{cbt_id}', 'TeacherController@getCBTResult', function () {
    })->middleware(Cors::class);

    Route::get('teacher/use-cbt-result/{cbt_id}/{use_result_for}/{subject_id}', 'TeacherController@useCBTResultFor', function () {
    })->middleware(Cors::class);

    // TEACHER {RESULT-UPLOAD}
    Route::post('teacher/student-registered', 'TeacherController@getStudentRegistered', function () {
    })->middleware(Cors::class);

    Route::post('teacher/upload-result', 'TeacherController@uploadResult', function () {
    })->middleware(Cors::class);

    Route::post('teacher/upload-comment-rating', 'TeacherController@uploadCommentAndRating', function () {
    })->middleware(Cors::class);


    // TEACHER {ATTENDANCE}
    Route::post('teacher/take-attendance', 'TeacherController@takeAttendance', function () {
    })->middleware(Cors::class);

    Route::post('teacher/get-attendance', 'TeacherController@getAttendance', function () {
    })->middleware(Cors::class);

    // TEACHER {PROMOTE STUDENT}
    Route::post('teacher/promote-students', 'TeacherController@promoteStudents', function () {
    })->middleware(Cors::class);

    // TEACHER {LESSON PLAN}
    Route::post('teacher/save-lesson-plan', 'TeacherController@saveLessonPlan', function () {
    })->middleware(Cors::class);

    Route::post('teacher/lesson-plan', 'TeacherController@lessonPlan', function () {
    })->middleware(Cors::class);

});

// =============================================================================
//               END OF TEACHER ROUTE
// =============================================================================


// =============================================================================
//               BEGINNING OF STUDENT ROUTE
// =============================================================================
// STUDENT {SIGNIN}
Route::post('student/signin', 'StudentController@signIn', function () {
})->middleware(Cors::class);

Route::middleware('auth:sanctum')->group(function () {
    // STUDENT {SUBJECT}
    Route::post('student/register-subject', 'StudentController@registerSubject', function () {
    })->middleware(Cors::class);

    Route::post('student/registered-subject', 'StudentController@getRegisteredSubject', function () {
    })->middleware(Cors::class);

    Route::post('student/registered-subject-id', 'StudentController@getRegisteredSubjectID', function () {
    })->middleware(Cors::class);

    //STUDENT {CBT}
    Route::get('student/taken-cbt/{cbt_id}/{student_id}', 'StudentController@checkIfStudenHasTakenCBT', function () {
    })->middleware(Cors::class);

    Route::post('student/submit-cbt', 'StudentController@submitCBT', function () {
    })->middleware(Cors::class);

    // STUDENT {PAYMENT}
    Route::post('student/all-fee', 'StudentController@allFee', function () {
    })->middleware(Cors::class);

    Route::post('student/payment-history', 'StudentController@paymentHistory', function () {
    })->middleware(Cors::class);

    Route::post('student/add-optional-fee', 'StudentController@addOptionalFee', function () {
    })->middleware(Cors::class);

    // STUDENT {RESULT}
    Route::post('student/result', 'StudentController@getResult', function () {
    })->middleware(Cors::class);

    Route::post('student/comments-psycho', 'StudentController@getCommentsAndPsycho', function () {
    })->middleware(Cors::class);

    // STUDENT {ATTENDANCE}
    Route::post('student/attendance-summary', 'StudentController@attendanceSummary', function () {
    })->middleware(Cors::class);
});

// =============================================================================
//               END OF STUDENT ROUTE
// =============================================================================





// =============================================================================
//               BEGINNING OF BURSARY ROUTE
// =============================================================================
// BURSARY {SIGNIN}
Route::post('bursary/signin', 'BursaryController@signIn', function () {
})->middleware(Cors::class);

Route::middleware('auth:sanctum')->group(function () {
    // BURSARY {FEE MANAGEMENT}
    Route::post('bursary/create-fee', 'BursaryController@createFee', function () {
    })->middleware(Cors::class);

    Route::post('bursary/edit-fee', 'BursaryController@editFee', function () {
    })->middleware(Cors::class);

    Route::get('bursary/delete-fee/{fee_id}', 'BursaryController@deleteFee', function () {
    })->middleware(Cors::class);

    Route::post('bursary/all-fee', 'BursaryController@allFee', function () {
    })->middleware(Cors::class);

    // BURSARY {EXPENSE MANAGEMENT}
    Route::post('bursary/create-expense', 'BursaryController@createExpense', function () {
    })->middleware(Cors::class);

    Route::post('bursary/edit-expense', 'BursaryController@editExpense', function () {
    })->middleware(Cors::class);

    Route::get('bursary/delete-expense/{expense_id}', 'BursaryController@deleteExpense', function () {
    })->middleware(Cors::class);

    Route::post('bursary/all-expense', 'BursaryController@allExpense', function () {
    })->middleware(Cors::class);


    // BURSARY {MANUAL PAYMENT MANAGEMENT}
    Route::post('bursary/create-manual-payment', 'BursaryController@createManualPayment', function () {
    })->middleware(Cors::class);

    Route::post('bursary/edit-manual-payment', 'BursaryController@editManualPayment', function () {
    })->middleware(Cors::class);

    Route::get('bursary/delete-manual-payment/{manual_payment_id}', 'BursaryController@deleteManualPayment', function () {
    })->middleware(Cors::class);

    Route::post('bursary/all-manual-payment', 'BursaryController@allManualPayment', function () {
    })->middleware(Cors::class);


    // BURSARY {PAYMENT HISTORY}
    Route::post('bursary/all-payment-history', 'BursaryController@allPaymentHistory', function () {
    })->middleware(Cors::class);

    Route::post('bursary/search-payment-history', 'BursaryController@searchPayment', function () {
    })->middleware(Cors::class);

    // BURSARY {DEBITORS MANAGEMENT}
    Route::post('bursary/sync-lastest-debitor', 'BursaryController@syncLastestDebitor', function () {
    })->middleware(Cors::class);

    Route::post('bursary/all-debitor', 'BursaryController@allDebitor', function () {
    })->middleware(Cors::class);

    // BURSARY {DASHBOARD INFO}
    Route::post('bursary/dashboard-information', 'BursaryController@getDashboardInfo', function () {
    })->middleware(Cors::class);
});

// =============================================================================
//               END OF BURSARY ROUTE
// =============================================================================




// ===================================================================
// GENERAL ROUTE
// ===================================================================

Route::get('general/school-details', 'GeneralController@getSchoolDetails', function () {
})->middleware(Cors::class);


Route::get('general/current-session', 'GeneralController@getCurrentSession', function () {
})->middleware(Cors::class);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('general/all-session', 'GeneralController@allSession', function () {
    })->middleware(Cors::class);
});
// ===================================================================
// END OF GENERAL ROUTE
// ===================================================================
