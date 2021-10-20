<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StudentModel extends Model
{
    protected $table = 'student';
    protected $primaryKey = 'id';
    public $timestamps = false;


    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class');
    }
}
