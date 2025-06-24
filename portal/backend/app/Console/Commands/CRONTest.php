<?php

namespace App\Console\Commands;

use App\Http\Controllers\GeneralController;
use App\Model\IdempotencyKey;
use App\Model\ActivityLogModel;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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

        try {
            $data = GeneralController::getSchools();

            foreach ($data as $school) {
                // if (in_array($school['alias'], ['mss'])) {
                //     continue;
                // }

                try {
                    //\Log::info("Running CRON for ... " . $school['alias']);
                    config(['database.default' => $school['alias']]);

                    IdempotencyKey::where('expires_at', '<', now())->forceDelete();
                    ActivityLogModel::where('created_at', '<=', now()->subMonths(3))->forceDelete();



                    //\Log::info('CRON TEST RAN NOW ...' . Carbon::now()->toDateTimeString());
                    //\Log::info("Completed migration for ... " . $school['alias']);
                } catch (\Throwable $th) {
                    // \Log::error("Error running CRON for ... " . $school['alias']);
                    // \Log::error($th->getMessage());
                }

            }

            //\Log::info('CRON tasks executed successfully at ' . now());

        } catch (\Exception $e) {
            Log::error('CRON failed: ' . $e->getMessage());
        }

    }


}
