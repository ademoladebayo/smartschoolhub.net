<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class FeeModel extends Authenticatable
{
    use  Notifiable, HasApiTokens;
    protected $table = 'fee';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function pay_by()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class');
    }
}
