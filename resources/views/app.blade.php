<!DOCTYPE html>
<html data-theme="light">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="modulepreload" href="{{ Vite::asset('resources/js/app.jsx') }}">

    @php $company = app("currentCompany"); @endphp
    <link rel="icon" href="{{ asset($company?->favicon_path) }}" type="image/png">

    <title>Track Wise</title>

    @if ($company)
        <style>
            :root {
                --color-one: {{ $company->color_one }};
                --color-two: {{ $company->color_two }};
                --color-three: {{ $company->color_three }};
                --color-four: {{ $company->color_four }};
                --color-five: {{ $company->color_five }};
            }
        </style>
    @endif
    
    @viteReactRefresh
    @vite('resources/js/app.jsx')

    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>