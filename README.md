# Flowwow - веб-сайт для цветочного магазина
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 

Интернет-магазин цветов с каталогом, корзиной, оформлением заказов, авторизацией и админ-панелью. Работа выполнена в рамках учебной практики УП.04.01 «Сопровождение и обслуживание программного обеспечения компьютерных систем»

---
## Стек технологий
- **Backend:** Django 6.0.3, SQLite
- **Frontend:** HTML5, CSS3, JavaScript
- **Инструменты:** Git, pip, virtualenv

## Структура проекта
```
flowers/
├── .venv/ 
│   └── ...
│
├── manage.py
├── requirements.txt
├── db.sqlite3
├── .env
│
├── flowers/                          # каталог с настройками проекта
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
└── flowwow/                          # приложение сайта
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    ├── urls.py
    ├── views.py
    │
    ├── migrations/                   # миграции БД
    │   └── ...
    │
    ├── static/                       # статические файлы
    │   └── flowwow/
    │       ├── css/
    │       │   └── style.css
    │       ├── img/                  
    │       │   └── ...
    │       └── js/
    │           └── cart.js
    │           └── catalog.js
    │           └── data.js
    │           └── utils.js
    │
    └── templates/                    # HTML-страницы, шаблоны
    │   └── flowwow/
    │       ├── layout.html           # базовый шаблон
    │       ├── modal.html            # шаблон для модальных блоков
    │       ├── index.html            
    │       ├── about.html            
    │       ├── article.html          
    │       ├── articles.html          
    │       ├── catalog.html            
    │       ├── order.html
    │       └── product.html
    │
	└── media/                        # изображения из БД
		└── products/
			└── ...
```

## Установка и запуск
1. Клонировать репозиторий:
```
git clone https://github.com/kyuuuiii/flowers.git
cd flowers
```
2. Создать виртуальное окружение и активировать:
```
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```
3. Установить зависимости:
```
pip install -r requirements.txt
```
4. Выполнить миграции:
```
python manage.py migrate
```
5. Запустить сервер разработки:
```
python manage.py runserver
```
6. Перейти по адресу [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Распределение задач
- Скрипникова С.О. - архитектура на Django: настройка проекта, проектирование базы данных, модели, миграции, маршрутизация, контроллеры, реализация бизнес-логики (корзина, заказы, фильтрация, аутентификация), настройка админ-панели, обеспечение безопасности, перенос частей верстки в шаблоны с выделением динамического содержимого.
- Хавронина В. А. - фронтенд-разработка, дизайн: исправление и доработка статических HTML/CSS/JS, ребрендинг дизайна и его разработка для новых страниц, адаптивная вёрстка, обеспечение доступности (alt, клавиатурная навигация). Работа с чистыми технологиями без фреймворков.
