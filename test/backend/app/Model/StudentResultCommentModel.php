<?php

namespace App\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StudentResultCommentModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;

    protected $table = 'student_result_comment';
    protected $primaryKey = 'id';
    public $timestamps = false;


   
}
