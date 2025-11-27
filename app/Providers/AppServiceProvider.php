<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use App\Models\Materia;
use App\Models\Comision;
use App\Observers\MateriaObserver;
use App\Observers\ComisionObserver;


class AppServiceProvider extends ServiceProvider
{

    
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Vite::prefetch(concurrency: 3);
        Materia::observe(MateriaObserver::class);
        Comision::observe(ComisionObserver::class);
    }
}
