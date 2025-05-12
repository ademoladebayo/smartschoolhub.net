<?php

namespace App\Http\Controllers;

use App\Repository\SessionRepository;
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
            $result_session = DB::select('SELECT distinct session,  term FROM subject_registration where student_id =' . explode("-", $sort)[1]);
            return $result_session;

        } else if (str_contains($sort, 'PAY')) {
            $payment_session = DB::select('SELECT distinct session,  term FROM payment_history where student_id =' . explode("-", $sort)[1]);
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


    public function runMigration(Request $request)
    {
        $client = new \GuzzleHttp\Client();
        //  $route = "https://smartschoolhub.net/backend/website/api/schools";
        $route = "http://localhost:8001/api/schools";
        try {
            // CALL ENDPOINT
            $response = $client->request("GET", $route, [
                'headers' => [
                    'accept' => 'application/json',
                    'content-type' => 'application/json',
                ],
            ]);

            $data = json_decode($response->getBody(), true);

            foreach ($data as $school) {
                //$school = $data[0];

                try {
                    \Log::info("Running migration for ... " . $school['alias']);
                    config(['database.default' => $school['alias']]);
                    Artisan::call('migrate');
                } catch (\Throwable $th) {
                    \Log::info("Error running migration for ... " . $school['alias']);
                    \Log::info($th->getMessage());
                }

            }

            return "Migration completed successfully for all schools";
        } catch (\Throwable $th) {
            \Log::info($th->getMessage());
        }
    }
}
