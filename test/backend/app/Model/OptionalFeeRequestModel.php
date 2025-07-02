<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class OptionalFeeRequestModel extends Model
{
    use  Notifiable, HasApiTokens;
    protected $table = 'optional_fee_request';
    protected $primaryKey = 'id';
    public $timestamps = true;

    public function student()
    {
        return $this->hasOne(StudentModel::class, 'id', 'student_id');
    }

    public function fee()
    {
        return $this->hasOne(FeeModel::class, 'id', 'fee_id');
    }
}
