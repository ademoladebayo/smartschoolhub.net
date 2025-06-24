<?php

namespace App\Http\Middleware;

use App\Jobs\ClearOldIdempotencyKeys;
use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Log;
use Symfony\Component\HttpFoundation\Response;

class PreventDuplicateRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */

    protected $pathToIgnore = [
        'backend/portal/api/admin/signin',
    ];


    public function handle($request, Closure $next)
    {
        Log::info($request->path());
        return $next($request);
        
        $school = $request->header("school");
        config(['database.default' => $school]);


        //Log::debug('PreventDuplicateRequest middleware triggered for path: ' . $request);
        $user = true; //$request->user();
        if (!$user || in_array($request->path(), $this->pathToIgnore)) {
            return $next($request);
        }

        //Log::info($request->path() . ' - ' . $request->method() . ' - ' . $user->id);

        if ($request->isMethod('POST') && $user) {
            $key = $request->header('x-idempotency-key') ??
                hash('sha256', $request->method() . '|' . $request->path() . '|' . $request->getContent());

            return DB::transaction(function () use ($key, $request, $next) {
                try {
                    DB::table('idempotency_keys')->insert([
                        'key' => $key,
                        'expires_at' => now()->addMinutes(3),
                    ]);
                } catch (\Exception $e) {

                    return response()->json([
                        'success' => false,
                        'title' => 'Please Wait',
                        'message' => 'Please wait a moment before trying again.',
                        'msg' => 'Please wait a moment before trying again.'
                    ], Response::HTTP_OK);
                }
                return $next($request);
            });
        }
        return $next($request);
    }
}
