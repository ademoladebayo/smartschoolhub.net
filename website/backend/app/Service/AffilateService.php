<?php

namespace App\Service;

use App\Model\AffilateModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AffilateService
{
    public function createAffilate(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => ['required'],
            'last_name' => ['required'],
            'gender' => ['required'],
            'phone' => ['required'],
            'ppa_name' => ['required'],
            'ppa_state' => ['required'],
        ]);
        $AffilateModel = new AffilateModel();
        $AffilateModel->first_name =  $request->first_name;
        $AffilateModel->last_name =  $request->last_name;
        $AffilateModel->gender =  $request->gender;
        $AffilateModel->telephone =  $request->phone;
        $AffilateModel->ppa_name =  $request->ppa_name;
        $AffilateModel->ppa_state =  $request->ppa_state;
        $AffilateModel->save();

        return response(['success' => true, 'message' => "Thanks for registering , we will reach out to you."]);
    }
}
