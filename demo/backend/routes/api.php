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

    Route::get('teacher/cbt-result/{cbt_id}', 'TeacherController@getCBTResult', function () {
    })->middleware(Cors::class);

    Route::get('teacher/use-cbt-result/{cbt_id}/{use_result_for}/{subject_id}', 'TeacherController@useCBTResultFor', function () {
    })->middleware(Cors::class);

    // TEACHER {RESULT-UPLOAD}
    Route::post('teacher/student-registered', 'TeacherController@getStudentRegistered', function () {
    })->middleware(Cors::class);

    Route::post('teacher/upload-result', 'TeacherController@uploadResult', function () {
    })->middleware(Cors::class);

     // TEACHER {ATTENDANCE}
     Route::post('teacher/take-attendance', 'TeacherController@takeAttendance', function () {
    })->middleware(Cors::class);

    Route::post('teacher/get-attendance', 'TeacherController@getAttendance', function () {
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

    Route::get('student/taken-cbt/{cbt_id}/{student_id}', 'StudentController@checkIfStudenHasTakenCBT', function () {
    })->middleware(Cors::class);

    Route::post('student/submit-cbt', 'StudentController@submitCBT', function () {
    })->middleware(Cors::class);
});

// =============================================================================
//               END OF STUDENT ROUTE
// =============================================================================


//RESULT ROUTE
Route::post('save-result', 'ResultController@saveResult', function () {
})->middleware(Cors::class);

Route::get('result/{student_id}', 'ResultController@getAllresult', function () {
})->middleware(Cors::class);

Route::get('result/{student_id}/{term}', 'ResultController@getAllresult', function () {
})->middleware(Cors::class);

Route::get('result/{subject_id}/{term}', 'ResultController@getAllresult', function () {
})->middleware(Cors::class);






Route::get('getstatisticsdata', 'statisticscontroller\statisticscontroller@getallstatistics', function () {
    //
})->middleware(Cors::class);



Route::post('signup', 'ChatContoller\chatcontroller@signup', function () {
})->middleware(Cors::class);

Route::get('notify/{notify_amount}/{budget}/{id}', 'ExpenseTrackerController\ETcontroller@notify', function () {
    //
})->middleware(Cors::class);

// ===================================================================
// GENERAL ROUTE
// ===================================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('general/current-session', 'GeneralController@getCurrentSession', function () {
    })->middleware(Cors::class);
});
// ===================================================================
// END OF GENERAL ROUTE
// ===================================================================
