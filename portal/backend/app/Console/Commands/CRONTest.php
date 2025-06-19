<?php

namespace App\Console\Commands;

use App\IdempotencyKey;
use App\Model\ActivityLogModel;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CRONTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cron:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This scheduler runs every day at 13:00 to send marketing notifications';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        IdempotencyKey::where('expires_at', '<', now())
            ->forceDelete();

        ActivityLogModel::where('created_at', '<=', now()->subMonths(3))->forceDelete();
        \Log::info('CRON TEST RAN NOW ...' . Carbon::now()->toDateTimeString());

    }


}
