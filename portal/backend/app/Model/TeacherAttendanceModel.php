<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherAttendanceModel extends Model
{

 use SoftDeletes;
    protected $table = 'teacher_attendance';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function teacher()
    {
        return $this->hasOne(TeacherModel::class, 'id', 'teacher_id');
    }

   
}
