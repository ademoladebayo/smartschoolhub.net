<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class NoteModel extends Model
{
    protected $table = 'notes';
    protected $primaryKey = 'id';
    public $timestamps = false;

  
}
