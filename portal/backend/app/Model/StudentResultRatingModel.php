<?php

namespace App\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StudentResultRatingModel extends Model
{
    use  Notifiable, HasApiTokens;

    protected $table = 'student_result_rating';
    protected $primaryKey = 'id';
    public $timestamps = true;
}
