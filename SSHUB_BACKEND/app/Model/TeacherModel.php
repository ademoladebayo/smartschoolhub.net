<?php

namespace App\Model;


use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class TeacherModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;

    protected $table = 'teacher';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public function assigned_class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'assigned_class');
    }

    protected $hidden = ['password'];
}
