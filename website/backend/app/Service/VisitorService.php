<?php

namespace App\Service;

use App\Model\VisitorModel;
use App\Repository\VisitorRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VisitorService
{
    public function saveVisitor(Request $request)
    {
        $visitorRepository = new VisitorRepository();
        //    FIRST CHECK IF VISITOR HAS BEEN HERE
        $visitor =  $visitorRepository->doesVisitorExist($request->IP);
        if ($visitor == null) {
            // SAVE 
            $visitorModel = new VisitorModel();
            $visitorModel->IP = $request->IP;
            $visitorModel->first_seen = $request->date;
            $visitorModel->last_seen = $request->date;
            $visitorModel->save();
            return response(['success' => true, 'message' => "Thanks for visiting ..."]);
        } else {
            // UPDATE LAST VISIT
            $visitor->last_seen = $request->date;
            $visitor->save();
            return response(['success' => true, 'message' => "Thanks for checking back ..."]);
        }
    }
}
