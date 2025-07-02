<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UploadModel extends Model
{

 // use SoftDeletes;
    protected $table = 'uploads';
    protected $primaryKey = 'id';
    public $timestamps = true;

  
}
