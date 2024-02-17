<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoutesTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_csrf_cookie_route(): void
    {
        $response = $this->get('/sanctum/csrf-cookie');
        $response->assertStatus(Response::HTTP_NO_CONTENT);
    }

    public function test_beers_api_route_fail(): void
    {
        $url = route('api.beers', ['page' => 0, 'limit' => 100]);
        $user = User::find(1);
        Sanctum::actingAs($user);
        $response = $this
            ->getJson($url)
            ->assertStatus(Response::HTTP_BAD_REQUEST)
        ;
    }

    public function test_beers_api_route_success(): void
    {
        $url = route('api.beers', ['page' => 0, 'limit' => 10]);
        $user = User::find(1);
        Sanctum::actingAs($user);
        $response = $this
            ->getJson($url)
            ->assertStatus(Response::HTTP_OK)
        ;
        $body = json_decode($response->content(), true);

        $this->assertTrue(is_array($body), 'Decoded response is not an array');
        $this->assertTrue(count($body) === 10, 'Decoded response array length is not 10');
    }
}
