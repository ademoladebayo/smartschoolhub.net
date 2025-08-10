<?php

namespace App\Repository;

use App\Model\PortalSubscription;
use App\Model\SessionModel;
use App\Model\ControlPanelModel;
use App\Service\AdminService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SessionRepository
{
    public function createSession(Request $request)
    {

        if (SessionModel::where('session', $request->session)->exists()) {
            return response()->json(['success' => false, 'message' => 'This session already exist']);
        }

        $PrevSessionModel = SessionModel::where('session_status', 'CURRENT')->first();
        Log::debug($PrevSessionModel);
        if ($PrevSessionModel != "") {
            $PrevSessionModel->session_status = "PAST";
            $PrevSessionModel->save();
        }

        $SessionModel = new SessionModel();
        $SessionModel->session = $request->session;
        $SessionModel->term = $request->term;
        $SessionModel->session_status = "CURRENT";
        $SessionModel->save();

        // CREATE A SUBSCRIPTION ID FOR THIS SESSION-TERM
        if (!PortalSubscription::where('subscription_id', 'LIKE', '%' . str_replace("/", "", $request->session) . '' . str_replace(" ", "", $request->term) . '%')->exists()) {
            $portalSubcription = new PortalSubscription();
            $portalSubcription->subscription_id = str_replace("/", "", $request->session) . "" . str_replace(" ", "", $request->term);
            $portalSubcription->description = '';
            $portalSubcription->status = 'NOT PAID';
            $portalSubcription->amount = 0;

            // UPDATE USAGE OF PAST OF PREVIOUS SESSION TERM
            if (count(PortalSubscription::orderBy("id", "DESC")->get()) > 0) {
                $subscription_fee = DB::table('school_details')->get()[0]->subscription_fee;
                $StudentRepository = new StudentRepository();
                //$student = $StudentRepository->allStudentCount();

                $previousPortalSubcription = PortalSubscription::orderBy("id", "DESC")->get()[0];
                $student = $this->getActiveStudent($previousPortalSubcription->subscription_id);
                if ($student < 1) {
                    return response()->json(['success' => false, 'message' => 'Something went wrong, please contact support.']);
                }

                $previousPortalSubcription->description = "USAGE CHARGE FOR " . $student . " STUDENTS";
                $previousPortalSubcription->amount = $student * intval($subscription_fee);
                $previousPortalSubcription->save();
            }
            $portalSubcription->save();
        }

        $this->closeResultAccess();
        return response()->json(['success' => true, 'message' => 'Session was created successfully.']);
    }

    public function editSession(Request $request)
    {
        $SessionModel = SessionModel::find($request->session_id);
        $SessionModel->session = $request->session;
        $SessionModel->term = $request->term;
        $SessionModel->save();

        // CREATE A SUBSCRIPTION ID FOR THIS SESSION-TERM
        if (!PortalSubscription::where('subscription_id', 'LIKE', '%' . str_replace("/", "", $request->session) . '' . str_replace(" ", "", $request->term) . '%')->exists()) {
            $portalSubcription = new PortalSubscription();
            $portalSubcription->subscription_id = str_replace("/", "", $request->session) . "" . str_replace(" ", "", $request->term);
            $portalSubcription->description = '';
            $portalSubcription->status = 'NOT PAID';
            $portalSubcription->amount = 0;

            // UPDATE USAGE OF PAST OF PREVIOUS SESSION TERM
            if (count(PortalSubscription::orderBy("id", "DESC")->get()) > 0) {
                $subscription_fee = DB::table('school_details')->get()[0]->subscription_fee;
                $StudentRepository = new StudentRepository();
                //$student = $StudentRepository->allStudentCount();

                $previousPortalSubcription = PortalSubscription::orderBy("id", "DESC")->get()[0];
                $student = $this->getActiveStudent($previousPortalSubcription->subscription_id);
                if ($student < 1) {
                    return response()->json(['success' => false, 'message' => 'Something went wrong, please contact support.']);
                }

                $previousPortalSubcription->description = "USAGE CHARGE FOR " . $student . " STUDENTS";
                $previousPortalSubcription->amount = $student * intval($subscription_fee);
                $previousPortalSubcription->save();
            }
            $portalSubcription->save();
        }

        $this->closeResultAccess();
        return response()->json(['success' => true, 'message' => 'Session updated successfully.']);
    }

    public function getActiveStudent($sessionId)
    {
        //$sessionId = "20242025THIRDTERM";

        // Extract session parts (assuming first 4 digits are start year, next 4 are end year)
        $startYear = substr($sessionId, 0, 4);
        $endYear = substr($sessionId, 4, 4);

        // Format session as "2024/2025"
        $session = $startYear . '/' . $endYear;

        // Extract term (remaining string after year)
        $term = substr($sessionId, 8);

        // Format term with space (convert "THIRDTERM" to "THIRD TERM")
        $term = preg_replace('/([A-Z])([A-Z])/', '$1 $2', $term);

        return DB::table('subject_registration')
            ->where('total', '>', 0)
            ->where('term', $term)
            ->where('session', $session)
            ->distinct('student_id')
            ->count('student_id');
    }

    public function getCurrentSession()
    {
        if (count(SessionModel::where("session_status", "CURRENT")->get()) == 0) {
            return response()->json(['success' => false, 'message' => 'Welcome Admin, Please set you session first.']);
        } else {
            return response()->json(['success' => true, 'session' => SessionModel::where("session_status", "CURRENT")->get()[0]]);
        }
    }

    public function closeResultAccess()
    {
        $ControlPanel = ControlPanelModel::find(1);
        $ControlPanel->access_result = "NO";
        $ControlPanel->save();
    }
}
