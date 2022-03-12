<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class TeacherAttendanceModel extends Model
{
    protected $table = 'teacher_attendance';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function teacher()
    {
        return $this->hasOne(TeacherModel::class, 'id', 'teacher_id');
    }

   
}
