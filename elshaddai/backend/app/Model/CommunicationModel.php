<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class CommunicationModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;
    protected $table = 'communication';
    protected $primaryKey = 'id';
    public $timestamps = false;


    public function sender()
    {
        return $this->hasOne(TeacherModel::class, 'id', 'class_teacher');
    }
}
