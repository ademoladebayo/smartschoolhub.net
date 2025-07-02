<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectModel extends Model
{

 // use SoftDeletes;
    protected $table = 'subject';
    protected $primaryKey = 'id';
    public $timestamps = true;

    public function teacher()
    {
        return $this->hasOne(TeacherModel::class, 'id', 'teacher');
    }
    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class');
    }
}
