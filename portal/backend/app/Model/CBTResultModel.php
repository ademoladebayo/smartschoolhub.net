<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CBTResultModel extends Model
{

 use SoftDeletes;
    protected $table = 'cbt_result';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function student()
    {
        return $this->hasOne(StudentModel::class, 'id', 'student_id');
    }

}
