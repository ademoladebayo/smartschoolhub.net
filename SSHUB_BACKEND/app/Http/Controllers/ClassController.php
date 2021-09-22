<?php

namespace App\Http\Controllers;

use App\Model\ClassModel;
use App\Repository\ClassRepository;
use App\Service\ClassService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClassController extends Controller
{
    public function createClass(Request $request)
    {
        $ClassService = new ClassService();
        return $ClassService->createClass($request);
    }

    public function getAllClass()
    {
        $classRepository = new ClassRepository();
        return $classRepository->getAllClass();
    }
}
