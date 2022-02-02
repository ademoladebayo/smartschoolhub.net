<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class SubjectRegistrationModel extends Model
{
    protected $table = 'subject_registration';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class_id');
    }

    public function student()
    {
        return $this->hasOne(StudentModel::class, 'id', 'student_id');
    }

    public function subject()
    {
        return $this->hasOne(SubjectModel::class, 'id', 'subject_id');
    }
}
