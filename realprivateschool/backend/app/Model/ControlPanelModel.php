<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class ControlPanelModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;
    protected $table = 'control_panel';
    protected $primaryKey = 'id';
    public $timestamps = false;

}
