<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class GradeSettingsModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;
    protected $table = 'grade_settings';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
