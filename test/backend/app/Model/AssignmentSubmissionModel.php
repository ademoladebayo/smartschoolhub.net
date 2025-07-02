<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssignmentSubmissionModel extends Model
{

 // use SoftDeletes;
    protected $table = 'assignment_submission';
    protected $primaryKey = 'id';
    public $timestamps = true;

  
}
