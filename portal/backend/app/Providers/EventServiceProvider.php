<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Model\TeacherAttendanceModel;
use App\Model\StudentAttendanceModel;
use App\Observer\DuplicateAttendanceObserverForStudentAttendance;
use App\Observer\DuplicateAttendanceObserverForTeacherAttendance;


class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        TeacherAttendanceModel::observe(DuplicateAttendanceObserverForTeacherAttendance::class);
        StudentAttendanceModel::observe(DuplicateAttendanceObserverForStudentAttendance::class);
        //
    }
}
