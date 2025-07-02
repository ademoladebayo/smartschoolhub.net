<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentAttendanceModel extends Model
{

 use SoftDeletes;
    protected $table = 'student_attendance';
    protected $primaryKey = 'id';
    public $timestamps = true;

    public function student()
    {
        return $this->hasOne(StudentModel::class, 'id', 'student_id');
    }

    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class_id');
    }
}
