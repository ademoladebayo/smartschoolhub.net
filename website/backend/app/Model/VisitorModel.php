<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class VisitorModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;
    protected $table = 'visitors';
    protected $primaryKey = 'id';
    public $timestamps = false;



}
