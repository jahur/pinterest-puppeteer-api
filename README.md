# Pinterest Puppeteer API

✅ A headless Puppeteer scraper to get Pinterest keyword suggestions reliably.

## 🚀 Run locally

```bash
npm install
node server.js
```

Visit: http://localhost:3000

POST to `/pinterest-suggest` with JSON:
```json
{
  "keyword": "cake"
}
```

## 🔑 Deploy

Deploy on:
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Fly.io](https://fly.io/)

Make sure you add:
- `--no-sandbox` flag for Puppeteer.
- Port `3000` or `$PORT` for your environment.

## ✅ Example curl

```bash
curl -X POST http://localhost:3000/pinterest-suggest -H "Content-Type: application/json" -d '{"keyword":"wedding decor"}'
```

### 🔑 Now call this API from your WordPress plugin:

```php
$response = wp_remote_post( 'https://YOUR-PUPPETEER-API-URL/pinterest-suggest', array(
    'timeout' => 20,
    'headers' => array( 'Content-Type' => 'application/json' ),
    'body' => json_encode( array( 'keyword' => $keyword ) ),
) );
```