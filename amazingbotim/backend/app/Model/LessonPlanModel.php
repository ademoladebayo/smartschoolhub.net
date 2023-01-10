<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class LessonPlanModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;
    protected $table = 'lesson_plan';
    protected $primaryKey = 'id';
    public $timestamps = false;


    public function subject()
    {
        return $this->hasOne(SubjectModel::class, 'id', 'subject_id');
    }


}
