<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class FeeModel extends Model
{
    use  Notifiable, HasApiTokens;
    protected $table = 'fee';
    protected $primaryKey = 'id';
    public $timestamps = true;

    public function pay_by()
    {
        return $this->hasOne(ClassModel::class, 'id', 'class');
    }
}
