<?php

namespace App\Repository;

use App\Model\VisitorModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class VisitorRepository
{

    public function doesVisitorExist($visitor)
    {
        return  VisitorModel::where('IP', $visitor)->get()->first();
    }
}
