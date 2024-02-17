<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * This method simply returns the main view of the application
     *
     * @param Request $request
     *
     */
    public function getPage(Request $request)
    {
        return view('index');
    }
}
