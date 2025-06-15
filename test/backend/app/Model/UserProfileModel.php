<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserProfileModel extends Model
{

 use SoftDeletes;
    protected $table = 'user_profile';
    protected $primaryKey = 'id';
    public $timestamps = false;

    
}
