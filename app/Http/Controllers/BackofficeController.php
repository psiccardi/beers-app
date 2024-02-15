<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BackofficeController extends Controller
{
    //
    public function getPage(Request $request)
    {
        return view('index');
    }
}
