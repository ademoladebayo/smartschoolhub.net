<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;

class SwitchDatabaseConnection
{
    public function handle($request, Closure $next)
    {
        $school_name = $request->header("school");
        config(['database.default' => $school_name]);
        return $next($request);
    }
}
