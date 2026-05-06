# TapTile Frontend (React + Vite)

React-версия фронтенда для игры TapTile под ваш Spring Boot API.

## Что реализовано

- Игровой раунд 30 секунд (4x4 плитки).
- Сохранение результата: `POST /api/v1/scores/`.
- Топ рекордов: `GET /api/v1/scores/top/taptile`.
- Рейтинг: `POST /api/v1/ratings/`, средний `GET /api/v1/ratings/avg/taptile`.
- Комментарии: `POST /api/v1/comments/`, список `GET /api/v1/comments/by-game/taptile`.

## Запуск

1. Установите зависимости:
   - `npm install`
2. Создайте `.env` из примера:
   - скопируйте `.env.example` в `.env`
3. Запустите dev-сервер:
   - `npm run dev`

По умолчанию используется:

- `VITE_API_BASE_URL=http://13.60.221.232:8080/api/v1`

## Docker

### Запуск через Docker Compose

1. (Опционально) задайте API URL для сборки:
   - `set VITE_API_BASE_URL=http://13.60.221.232:8080/api/v1`
2. Соберите и запустите контейнер:
   - `docker compose up --build`
3. Откройте приложение:
   - `http://13.60.221.232:5173`

### Запуск через Dockerfile

1. Соберите образ:
   - `docker build -t taptile-frontend --build-arg VITE_API_BASE_URL=http://13.60.221.232:8080/api/v1 .`
2. Запустите контейнер:
   - `docker run --rm -p 5173:80 taptile-frontend`

**Другой хост:** задайте `--build-arg VITE_API_BASE_URL=...` и переменную `APP_CORS_ALLOWED_ORIGINS` в корневом `docker-compose` / `.env`.

## Нужен ли CORS?

Да, если фронт и бэк на разных origin.

- В dev-режиме Vite обычно будет `http://localhost:5173`, а бэк `http://localhost:8080`.
- Это разные origin, поэтому браузер потребует CORS-разрешение на бэкенде.
- Если раздаете фронт тем же origin, что и бэк (например, через один домен и порт через reverse proxy), CORS можно не включать.
