<?php
namespace App\Http\Middleware;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

use Closure;

class SwitchDatabaseConnection
{
    public function handle($request, Closure $next)
    {
        $school_name = $request->header("school");
        // Log::debug("ksskksjsjsjjssj".$school_name);
        config(['database.default' => $school_name]);
        Cache::put('database.default', $school_name, 120);
        return $next($request);
    }
}
