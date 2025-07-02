<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssignmentModel extends Model
{

    use SoftDeletes;
    protected $table = 'assignment';
    protected $primaryKey = 'id';
    public $timestamps = true;


}
