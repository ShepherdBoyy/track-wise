<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403, "Unauthorized");
        }

        if (!$user->hasAnyPermission($permissions)) {
            abort(403, "You do not have permission to this action");
        }

        return $next($request);
    }
}
