<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\AdminModel;
use App\Model\BursaryModel;
use App\Model\TeacherModel;
use App\Model\StudentModel;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{

    public function notify(Request $request)
    {
        //$firebaseToken = User::whereNotNull('device_token')->pluck('device_token')->all();
        $firebaseToken = ['f4jt6CMxnaeJSA_hxdH91F:APA91bHmq_qHfZjaARyL-Uo7pVpTai3tBoh5_U8LCy2bLmVUZ2hdVTcMUIhyv9yzB_TTiAzsn3Dc9953AcazGhS0t3TzE4Vf3NwZ8TB-ZePNCNpKp-3NJJIEl_Pjt_wjMvjxuLK5oZOo', 'f4jt6CMxnaeJSA_hxdH91F:APA91bEO6Q2_ZA3ytrYBOuHjQHzxnheOAQrMEM2issS2cLFaPk_eY9tAAvvgr_NpP2AmbpYeg3NutwJmRyphqSLUROPUwtY7Of_DU5JxTyLxox7lFq6htNhJlieRaVkaBDbNrvF4BnQt', 'eoW4SU9g7r6XJ_1BV6bCH8:APA91bG_Tf6XW3N596TkHBJj7P6rXq3cm342ZCDF_Q1Kw6Sisfcjsr541aSOVY6DHJCz9bR09BgbsflxrI0WXhtLmt6rKq-rswSSljXF3U0qhQJOx-MAY1UM2zgKjv2DFBuHH_gt0t_j'];


        $SERVER_API_KEY = 'AAAA_-z-9Mo:APA91bG1MD6ID7OUqBgt_Djq-HZlYjUz7U6B8jmAO5yXFyLWT2ViijZp0Dp43nzbY5raw-rX2uE8fpwrdJEedlXs-s2nHwygG41jc-gJ9b4FCWztasNzFP6m6O4Du_e2O2JVscfn3QQL';

        $data = [
            "registration_ids" => $firebaseToken,
            "notification" => [
                "title" => $request->title,
                "body" => $request->body,
                "content_available" => true,
                "priority" => "high",
            ]
        ];
        $dataString = json_encode($data);

        $headers = [
            'Authorization: key=' . $SERVER_API_KEY,
            'Content-Type: application/json',
        ];

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);

        $response = curl_exec($ch);

        dd($response);
    }

    public static function createNotification($title, $message, $reciever)
    {
        $AccessToken = self::generateFcmAccessToken(public_path('firebase-service-account.json'));

        $logo = "https://portal.smartschoolhub.net/icons/120.png";

        $receiverString = $reciever;//implode(', ', $reciever); 
        $receiverString = "cnv_2zXC0aoBtj0OJMu8I8:APA91bE98lRNhQk02aMYafpKgHAerHKHV-78G3Ax1M05Z84-0RcQngNChJTyzdbJZis7A-114ZG3j4CSAuW8zj1zYSTXTJ8sZQeRDUqrHDqnI21G7wXcq-Q";

        Log::alert("SENDING NOTIFICATION :::::::::: " . $title . " " . $message . " " . $receiverString);


        $fields = array(
            'message' => array(
                'token' => $receiverString,
                "notification" => array("body" => $message, "title" => $title),
                'data' => array("title" => $title, "message" => $message, "image" => $logo, "type" => "none", "click_action" => "FLUTTER_NOTIFICATION_CLICK"),
            ),
        );


        $ch = curl_init();
        $projectID = 'dextroux-technologies';
        $headers = array('https://fcm.googleapis.com/v1/projects/' . $projectID . '/messages:send', 'Content-Type: application/json', 'Authorization: Bearer ' . $AccessToken);


        curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/v1/projects/' . $projectID . '/messages:send');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

        $response = curl_exec($ch);

        Log::debug("NOTIFICATION RESPONSE ::: " . $response);
    }


    private static function generateFcmAccessToken($serviceAccountFile)
    {
        $serviceAccount = file_get_contents($serviceAccountFile);
        $serviceAccountData = json_decode($serviceAccount, true);

        $now = time();

        $payload = [
            'iss' => $serviceAccountData['client_email'],
            'sub' => $serviceAccountData['client_email'],
            'aud' => 'https://fcm.googleapis.com/',
            'iat' => $now,
            'exp' => $now + 3600, // Expires in one hour
        ];

        $privateKey = $serviceAccountData['private_key'];

        $token = JWT::encode($payload, $privateKey, 'RS256');

        return $token;
    }


    public function saveToken(Request $request)
    {
        $user_type = $request->user_type;
        if ($user_type == "ADMIN") {
            $admin = AdminModel::find($request->id);
            $admin->device_token = $request->device_token;
            $admin->save();
        } elseif ($user_type == "BURSARY") {
            $bursar = BursaryModel::find($request->id);
            $bursar->device_token = $request->device_token;
            $bursar->save();
        } elseif ($user_type == "TEACHER") {
            $teacher = TeacherModel::find($request->id);
            $teacher->device_token = $request->device_token;
            $teacher->save();
        } elseif ($user_type == "STUDENT") {
            $student = StudentModel::find($request->id);
            $student->device_token = $request->device_token;
            $student->save();
        } else {
            $student = StudentModel::find($request->id);
            $student->guardian_device_token = $request->device_token;
            $student->save();
        }
        return response(['success' => true, 'message' => "Device token saved."]);
    }
}
