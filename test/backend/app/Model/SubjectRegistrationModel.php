<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectRegistrationModel extends Model
{

 // use SoftDeletes;
    protected $table = 'subject_registration';
    protected $primaryKey = 'id';
    public $timestamps = true;

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
