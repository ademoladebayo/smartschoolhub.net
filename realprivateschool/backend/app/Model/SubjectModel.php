<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class SubjectModel extends Model
{
    protected $table = 'subject';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function teacher()
    {
        return $this->hasOne(TeacherModel::class, 'id', 'teacher');
    }
    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class');
    }
}
