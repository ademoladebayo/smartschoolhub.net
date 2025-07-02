<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CBTModel extends Model
{

 // use SoftDeletes;
    protected $table = 'cbt';
    protected $primaryKey = 'id';
    public $timestamps = true;

    public function subject()
    {
        return $this->hasOne(SubjectModel::class, 'id', 'subject_id');
    }

    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class_id');
    }

    // protected $hidden = ['cbt_answer'];
}
