<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassModel extends Model
{

 // use SoftDeletes;
    protected $table = 'class';
    protected $primaryKey = 'id';
    public $timestamps = true;

    public function class_teacher()
    {
        return $this->hasOne(TeacherModel::class, 'id', 'class_teacher');
    }
}
