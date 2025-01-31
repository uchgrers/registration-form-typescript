# Registration Form

## Описание проекта
Форма регистрации и входа пользователей. Приложение включает серверную часть, реализованную на **Express.js**. Пользователь остается авторизованным после перезагрузки страницы благодаря использованию **JWT**.

---

## Функционал
- Регистрация/авторизация пользователя.
- Регистрация пользователя через cookies при первом подключении.
- навигация авторизованного пользователя на главную страницу.
- Хранение данных на серверной стороне (для деплояна **Vercel** использованы serverless functions, а также хранилище на **Redis**).

---

## Используемые технологии

### Frontend
- React
- Redux Toolkit
- TypeScript
- SCSS

### Backend
- Node.js
- Express.js
- Cookies для авторизации

### Сервисы и инструменты
- Vercel + Redis (для деплоя)
- Git/GitHub

---

## Демо
[Посмотреть проект](https://registration-form-typescript.vercel.app)

---

## Установка и запуск

### Frontend
npm start

### Backend
cd server ->
node server