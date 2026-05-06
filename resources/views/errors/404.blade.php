<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page not found</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #FAF8F4;
            color: #1A1A1A;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
        }
        .ornament { margin-bottom: 2rem; opacity: 0.15; }
        .code {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(4rem, 12vw, 8rem);
            font-weight: 400;
            line-height: 1;
            color: #1A1A1A;
            margin-bottom: 1rem;
        }
        .divider {
            width: 40px;
            height: 1px;
            background-color: #C8A96E;
            margin: 0 auto 1.5rem;
        }
        .title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.5rem;
            font-weight: 400;
            margin-bottom: 1rem;
            color: #1A1A1A;
        }
        .subtitle {
            font-size: 0.875rem;
            font-weight: 300;
            color: #6B6560;
            margin-bottom: 2.5rem;
            line-height: 1.7;
            max-width: 360px;
        }
        .btn {
            display: inline-block;
            padding: 0.875rem 2rem;
            background-color: #1A1A1A;
            color: #FAF8F4;
            font-size: 0.6875rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-decoration: none;
            transition: background-color 0.2s;
        }
        .btn:hover { background-color: #C8A96E; color: #1A1A1A; }
        .btn-secondary {
            display: inline-block;
            margin-top: 1rem;
            font-size: 0.75rem;
            font-weight: 300;
            color: #9A9490;
            text-decoration: underline;
        }
        .btn-secondary:hover { color: #1A1A1A; }
    </style>
</head>
<body>
    <div class="ornament">
        <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#C8A96E" stroke-width="0.8"/>
            <circle cx="50" cy="50" r="25" stroke="#C8A96E" stroke-width="0.8"/>
            <line x1="50" y1="10" x2="50" y2="90" stroke="#C8A96E" stroke-width="0.8"/>
            <line x1="10" y1="50" x2="90" y2="50" stroke="#C8A96E" stroke-width="0.8"/>
        </svg>
    </div>

    <p class="code">404</p>
    <div class="divider"></div>
    <h1 class="title">Page not found</h1>
    <p class="subtitle">
        The page you are looking for no longer exists or has been moved.<br>
        Return to the home page to continue browsing.
    </p>

    <a href="/" class="btn">Back to home</a><br>
    <a href="/boutique" class="btn-secondary">View the shop →</a>
</body>
</html>
