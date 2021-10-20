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
    // TEACHER {CLASS}
    Route::post('teacher/create-class', 'TeacherController@createClass', function () {
    })->middleware(Cors::class);

    Route::post('teacher/edit-class', 'TeacherController@editClass', function () {
    })->middleware(Cors::class);

    Route::get('teacher/delete-class/{class_id}', 'TeacherController@deleteClass', function () {
    })->middleware(Cors::class);

    Route::get('teacher/all-class', 'TeacherController@getAllClass', function () {
    })->middleware(Cors::class);

    Route::get('teacher/search-class/{class_name}', 'TeacherController@searchClass', function () {
    })->middleware(Cors::class);

    // TEACHER {SUBJECT}
    Route::post('teacher/create-subject', 'TeacherController@createSubject', function () {
    })->middleware(Cors::class);

    Route::get('teacher/all-subject', 'TeacherController@getAllSubject', function () {
    })->middleware(Cors::class);

    Route::post('teacher/edit-subject', 'TeacherController@editSubject', function () {
    })->middleware(Cors::class);

    Route::get('teacher/delete-subject/{subject_id}', 'TeacherController@deleteSubject', function () {
    })->middleware(Cors::class);

    Route::get('teacher/search-subject/{subject_name}', 'TeacherController@searchSubject', function () {
    })->middleware(Cors::class);

    // TEACHER {STUDENT}
    Route::post('teacher/create-student', 'TeacherController@createStudent', function () {
    })->middleware(Cors::class);

    Route::post('teacher/edit-student', 'TeacherController@editStudent', function () {
    })->middleware(Cors::class);

    Route::get('teacher/all-student', 'TeacherController@getAllStudent', function () {
    })->middleware(Cors::class);

    Route::get('teacher/delete-student/{student_id}', 'TeacherController@deleteStudent', function () {
    })->middleware(Cors::class);

    Route::get('teacher/update-student-profilestatus/{id}', 'TeacherController@updateStudentProfileStatus', function () {
    })->middleware(Cors::class);

    Route::get('teacher/search-student/{search_data}', 'TeacherController@searchStudent', function () {
    })->middleware(Cors::class);


    // TEACHER {TEACHER}
    Route::post('teacher/create-teacher', 'TeacherController@createTeacher', function () {
    })->middleware(Cors::class);

    Route::post('teacher/edit-teacher', 'TeacherController@editTeacher', function () {
    })->middleware(Cors::class);

    Route::get('teacher/all-teacher', 'TeacherController@getAllTeacher', function () {
    })->middleware(Cors::class);

    Route::get('teacher/delete-teacher/{teacher_id}', 'TeacherController@deleteTeacher', function () {
    })->middleware(Cors::class);

    Route::get('teacher/update-teacher-profilestatus/{id}', 'TeacherController@updateTeacherProfileStatus', function () {
    })->middleware(Cors::class);

    Route::get('teacher/search-teacher/{search_data}', 'TeacherController@searchTeacher', function () {
    })->middleware(Cors::class);


    // TEACHER {SESSION MANAGEMENT}
    Route::post('teacher/create-session', 'TeacherController@createSession', function () {
    })->middleware(Cors::class);

    Route::post('teacher/edit-session', 'TeacherController@editSession', function () {
    })->middleware(Cors::class);

    Route::get('teacher/all-session', 'TeacherController@getAllSession', function () {
    })->middleware(Cors::class);
});


// =============================================================================
//               END OF TEACHER ROUTE
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
