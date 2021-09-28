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
// ADMIN {CLASS}
Route::post('create-class', 'AdminController@createClass', function () {
})->middleware(Cors::class);

Route::post('edit-class', 'AdminController@editClass', function () {
})->middleware(Cors::class);

Route::get('delete-class/{class_id}', 'AdminController@deleteClass', function () {
})->middleware(Cors::class);

Route::get('all-class', 'AdminController@getAllClass', function () {
})->middleware(Cors::class);

Route::get('search-class/{class_name}', 'AdminController@searchClass', function () {
})->middleware(Cors::class);

// ADMIN {SUBJECT}
Route::post('create-subject', 'AdminController@createSubject', function () {
})->middleware(Cors::class);

Route::get('all-subject', 'AdminController@getAllSubject', function () {
})->middleware(Cors::class);

// ADMIN {STUDENT}
Route::post('create-student', 'AdminController@createStudent', function () {
})->middleware(Cors::class);

// ADMIN {TEACHER}
Route::post('create-teacher', 'AdminController@createTeacher', function () {
})->middleware(Cors::class);
Route::get('all-teacher', 'AdminController@getAllTeacher', function () {
})->middleware(Cors::class);
// =============================================================================
//               END OF ADMIN ROUTE
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
