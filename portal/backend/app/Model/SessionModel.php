<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class SessionModel extends Model
{
    protected $table = 'session';
    protected $primaryKey = 'id';
    public $timestamps = false;

    
}
