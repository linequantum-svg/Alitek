# NovaMart

Готовий стартовий інтернет-магазин на Next.js + Prisma + Neon + Prom XML.

## Швидкий запуск update

1. Встанови залежності:

```bash
npm install
```

2. Скопіюй приклад змінних середовища:

```bash
cp .env.local.example .env.local
cp .env.local.example .env
```

3. Встав у `.env` та `.env.local` свій `DATABASE\\\\\\\_URL` з Neon.
4. Підготуй базу:

```bash
npx prisma generate
npx prisma db push
```

5. Запусти сайт:

```bash
npm run dev
```

6. Імпортуй товари з Prom:

```text
http://localhost:3000/api/sync-prom?token=123
```

7. Відкрий сайт:

```text
http://localhost:3000
```

Важливо

* `DATABASE\\\\\\\_URL` має бути у форматі `postgresql://...`
* якщо використовуєш Neon, для простоти локального запуску залиш тільки `DATABASE\\\\\\\_URL` без `DATABASE\\\\\\\_URL\\\\\\\_UNPOOLED`
* не зберігай реальні паролі в архівах або репозиторії

## Що вже є

* каталог товарів
* сторінка товару
* checkout
* замовлення в базу
* Telegram-сповіщення
* адмінка
* синхронізація з Prom XML

