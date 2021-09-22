<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    protected $table = 'class';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function class_teacher()
    {
        return $this->hasOne(TeacherModel::class, 'id', 'class_teacher');
    }
}
