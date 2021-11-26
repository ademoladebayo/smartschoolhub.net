<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class StudentAttendanceModel extends Model
{
    protected $table = 'student_attendance';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function student()
    {
        return $this->hasOne(StudentModel::class, 'id', 'student_id');
    }

    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class_id');
    }
}
