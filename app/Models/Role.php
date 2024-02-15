<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    const ADMINISTRATOR = 1;
    const OPERATOR = 2;

    public $timestamps = false;

    protected $fillable = [
        'name'
    ];
}
