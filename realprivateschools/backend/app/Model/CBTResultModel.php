<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class CBTResultModel extends Model
{
    protected $table = 'cbt_result';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function student()
    {
        return $this->hasOne(StudentModel::class, 'id', 'student_id');
    }

}
