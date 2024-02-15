<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Laravel</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        <style>
            html, body {
                margin: 0px;
            }
        </style>
    </head>
    <body class="antialiased ">
        <div id="index"></div>
        <script>
            const APP_URL = '{{ env('APP_URL') }}';
            const APP_NAME = '{{ env('APP_NAME') }}';
        </script>
        @vite('resources/js/index.js')
    </body>
</html>
