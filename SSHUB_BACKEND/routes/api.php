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


// STUDENT ROUTE
Route::post('create-student', 'StudentController@createStudent', function () {
})->middleware(Cors::class);


// TEACHER ROUTE
Route::post('create-teacher', 'TeacherController@createTeacher', function () {
})->middleware(Cors::class);
Route::get('all-teacher', 'TeacherController@getAllTeacher', function () {
})->middleware(Cors::class);


//ClASS ROUTE
Route::post('create-class', 'ClassController@createClass', function () {
})->middleware(Cors::class);

Route::get('all-class', 'ClassController@getAllClass', function () {
})->middleware(Cors::class);

//SUBJECT ROUTE
Route::post('create-subject', 'SubjectController@createSubject', function () {
})->middleware(Cors::class);

Route::get('all-subject', 'SubjectController@getAllSubject', function () {
})->middleware(Cors::class);

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
