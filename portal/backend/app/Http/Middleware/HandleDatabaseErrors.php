<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use PDOException;

class HandleDatabaseErrors
{
    public function handle($request, Closure $next)
    {
        $maxRetries = 3;
        $attempts = 0;

        while ($attempts < $maxRetries) {
            try {
                return $next($request);
            } catch (\Exception $e) {
                // Check for MySQL errors
                if (strpos($e->getMessage(), 'MySQL server has gone away') !== false) {
                    DB::reconnect();
                    $attempts++;
                    usleep(100000 * $attempts);
                    continue;
                } elseif (strpos($e->getMessage(), 'Packets out of order') !== false) {
                    DB::reconnect();
                    $attempts++;
                    usleep(200000 * $attempts);
                    continue;
                } elseif (strpos($e->getMessage(), 'Lock wait timeout exceeded') !== false) {
                    $attempts++;
                    usleep(rand(100000, 500000));
                    continue;

                } else if (strpos($e->getMessage(), 'Too many connections') !== false) {
                    try {
                        DB::disconnect(); // Close all database connections
                        app('db')->reconnect(); // Re-establish essential connection
                    } catch (\Exception $reconnectEx) {
                        \Log::error("Failed to reconnect: " . $reconnectEx->getMessage());
                    }
                }

                // Non-retryable exception
                throw $e;
            }
        }

        // Log final failure
        \Log::error('Database operation failed after ' . $maxRetries . ' attempts', [
            'error' => $e->getMessage(),
            'url' => $request->fullUrl()
        ]);

        throw $e;
    }
}