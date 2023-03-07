<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class LiveClassModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;
    protected $table = 'live_class';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
