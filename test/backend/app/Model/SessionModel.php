<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SessionModel extends Model
{

 // use SoftDeletes;
    protected $table = 'session';
    protected $primaryKey = 'id';
    public $timestamps = false;

    
}
