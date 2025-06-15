<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NoteModel extends Model
{

 use SoftDeletes;
    protected $table = 'notes';
    protected $primaryKey = 'id';
    public $timestamps = false;

  
}
