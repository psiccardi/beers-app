<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    //
    public function getPage(Request $request)
    {
        return view('index');
    }
}
