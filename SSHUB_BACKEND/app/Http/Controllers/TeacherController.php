<?php

namespace App\Http\Controllers;

use App\Model\TeacherModel;
use App\Service\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    // SIGNIN
    public function signIn(Request $request)
    {
        $TeacherService = new TeacherService();
        return $TeacherService->signIn($request);
    }
}
