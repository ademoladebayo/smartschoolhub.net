<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class AffilateModel extends Model
{
    use  Notifiable, HasApiTokens;
    protected $table = 'affilate_marketer';
    protected $primaryKey = 'id';
   // public $timestamps = true;



}
