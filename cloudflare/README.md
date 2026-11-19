# Qanchalik Bilasan boti — Cloudflare Workers

Render'dagi `index.js` o'rniga. Webhook + D1 baza + cron (kunlik savol, hammaga xabar).

## Sozlash
Cloudflare > Workers > qanchalik-bilasan-bot > Settings > Variables and Secrets:
- `BOT_TOKEN` (secret) — BotFather tokeni
- `WEBHOOK_SECRET` (secret) — o'zingiz o'ylab topgan uzun maxfiy so'z
- `ADMIN_IDS` — admin Telegram ID (vergul bilan bir nechta)
- ixtiyoriy: `DAILY_HOUR` (standart 19), `DAILY_OFF=1`, `STICKER_SETS`

## Webhook ulash
Brauzerda oching: `https://<worker>.workers.dev/setup?key=<WEBHOOK_SECRET>`
Tekshirish: `/debug?key=<WEBHOOK_SECRET>`

## Sinov
`npm test` (Node 22+)

Render'dagi eski zaxirani qaytarish: botda /admin > ♻️ Tiklash > 📌 Qadalgan zaxiradan tiklash.
