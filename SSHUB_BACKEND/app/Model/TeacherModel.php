<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class TeacherModel extends Model
{
    protected $table = 'teacher';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'assigned_class');
    }
}
