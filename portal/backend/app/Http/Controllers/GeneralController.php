<?php

namespace App\Http\Controllers;

use App\Repository\SessionRepository;
use App\Service\AdminService;
use App\Service\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralController extends Controller
{
    // SIGNIN
    public function getCurrentSession()
    {
        $SessionRepository = new SessionRepository();
        return $SessionRepository->getCurrentSession();
    }

    // SCHOOL DETAILS
    function getSchoolDetails()
    {
        return DB::table('school_details')->get();
    }

    // ALL SESSION
    function allSession($sort)
    {
        if (str_contains($sort, 'STD')) {
            $result_session = DB::select('SELECT distinct session,  term FROM subject_registration where student_id =' . explode("-", $sort)[1] . ' AND deleted_at is null');
            return $result_session;
        } else if (str_contains($sort, 'PAY')) {
            $payment_session = DB::select('SELECT distinct session,  term FROM payment_history where student_id =' . explode("-", $sort)[1] . ' AND deleted_at is null');
            return $payment_session;
        } else {
            if ($sort == "DESC") {
                return DB::table('session')->select('session')->orderBy('id', 'DESC')->get();
            }
            return DB::table('session')->select('session')->get();
        }
    }

    function storedCredentials()
    {
        return response(['PSPK' => env('PAYSTACK_PRIVATE_KEY'), 'PSSK' => env('PAYSTACK_SECRET_KEY')]);
    }

    public function bealsAlloy(Request $request)
    {
        $client = new \GuzzleHttp\Client();
        $body = array(
            "predicate" => $request->predicate,
            "run" => $request->run,
        );

        $body = json_encode($body, JSON_PRETTY_PRINT);
        try {
            // CALL ENDPOINT
            $response = $client->request("POST", 'http://ec2-13-58-136-200.us-east-2.compute.amazonaws.com:8080/api/alloy/run', [
                'body' => $body,
                'headers' => [
                    'accept' => 'application/json',
                    'content-type' => 'application/json',
                ],
            ]);

            return $response->getBody();
        } catch (\Throwable $th) {
            \Log::info($th);
        }
    }


    public function doTask(Request $request)
    {
        $adminService = new AdminService();

        if ($request->task == "RUN_MIGRATION") {
            return $this->runMigration();
        } else if ($request->task == "SEND_NOTIFICATION") {
            return $this->sendNotification();
        } else if ($request->task == "DUPLICATE_RESULT_CHECK") {
            return  $adminService->getStudentWithMultipleResult($request);
        } else {
            return response()->json(['success' => false, 'message' => 'Invalid task']);
        }
    }


    public function runMigration()
    {
        try {
            $data = self::getSchools();

            foreach ($data as $school) {
                //$school = $data[0];

                // if (in_array($school['alias'], ['mss'])) {
                //     continue;
                // }

                try {
                    \Log::info("Running migration for ... " . $school['alias']);
                    config(['database.default' => $school['alias']]);

                    # RESET LAST MIGRATION
                    DB::table('migrations')->truncate();

                    //Artisan::call('queue:table');
                    Artisan::call('migrate');
                    \Log::info("Completed migration for ... " . $school['alias']);
                } catch (\Throwable $th) {
                    \Log::error("Error running migration for ... " . $school['alias']);
                    \Log::error($th->getMessage());
                }
            }

            return "Migration completed successfully for all schools";
        } catch (\Exception $e) {
            Log::error('Migration failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Migration failed.']);
        }
    }

    public function sendNotification()
    {
        Log::info('1 Sending notification...');
        Log::debug(' 2Sending notification...');
        Log::error(' 3Sending notification...');
        Log::alert('4 Sending notification...');
        try {
            return NotificationController::createNotification('AMAZING BOTIM SCHOOL', 'Hello Ademola, Results is out !', 'dsQVq5kD78yrBUKbVF8gIX:APA91bHIwzlf06eyJKBbJsPQ_56LYLYJFkisPpFn0Ov8MBN1gyg1KBkwvES92ugQXoDwAwB_410BOcpmc4yOd9_yjrszsPd617ouHbQ8KQ6qg3D7zct8gA4');
        } catch (\Exception $e) {
            Log::error('Notification failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Notification failed.']);
        }
    }

    public static function getSchools()
    {
        // CALL ENDPOINT
        $client = new \GuzzleHttp\Client();
        $route = "https://smartschoolhub.net/backend/website/api/schools";
        //$route = "http://localhost:8001/api/schools";
        try {
            $response = $client->request("GET", $route, [
                'headers' => [
                    'accept' => 'application/json',
                    'content-type' => 'application/json',
                ],
            ]);

            return json_decode($response->getBody(), true);
        } catch (\Throwable $th) {
            \Log::info($th->getMessage());
            return [];
        }
    }
}
