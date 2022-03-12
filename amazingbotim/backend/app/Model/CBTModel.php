<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class CBTModel extends Model
{
    protected $table = 'cbt';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function subject()
    {
        return $this->hasOne(SubjectModel::class, 'id', 'subject_id');
    }

    public function class()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class_id');
    }
}
