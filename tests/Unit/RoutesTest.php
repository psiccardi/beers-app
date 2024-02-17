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

    public function test_login_web_invalid_credentials(): void
    {
        $params = [
            'username' => 'test',
            'password' => 'test',
            '_token' => csrf_token()
        ];
        $url = route('web.login');
        $response = $this->post($url, $params);
        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    public function test_login_web_successful(): void
    {
        $params = [
            'username' => 'root',
            'password' => 'password',
            '_token' => csrf_token()
        ];
        $url = route('web.login');
        $response = $this->post($url, $params);
        $response->assertStatus(Response::HTTP_OK);
        $decodedResponse = json_decode($response->content(), true);
        $this->assertTrue(!empty($decodedResponse["token"]), 'Token not retrieved');
        $this->assertTrue(!empty($decodedResponse["user"]), 'User not retrieved');
    }

    public function test_login_api_invalid_credentials(): void
    {
        $params = [
            'username' => 'test',
            'password' => 'test',
        ];
        $url = route('web.login');
        $response = $this->post($url, $params);
        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    public function test_login_api_successful(): void
    {
        $params = [
            'username' => 'root',
            'password' => 'password',
        ];
        $url = route('api.login');
        $response = $this->post($url, $params);
        $response->assertStatus(Response::HTTP_OK);
        $decodedResponse = json_decode($response->content(), true);
        $this->assertTrue(!empty($decodedResponse["token"]), 'Token not retrieved');
        $this->assertTrue(!empty($decodedResponse["user"]), 'User not retrieved');
    }

    public function test_beers_api_route_forbidden(): void
    {
        $url = route('api.beers', ['page' => 0, 'limit' => 10]);
        $user = User::find(1);
        $response = $this
            ->getJson($url)
            ->assertStatus(Response::HTTP_FORBIDDEN)
        ;
    }

    public function test_beers_api_route_bad_request(): void
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
