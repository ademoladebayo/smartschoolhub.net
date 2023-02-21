<?php

namespace App\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StudentModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;

    protected $table = 'student';
    protected $primaryKey = 'id';
    public $timestamps = false;


    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class');
    }

    protected $hidden = ['password','guardian_pass'];
}
