from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from .models import Category, Products, Articles, Order, Review, OrderItem

from django.db import IntegrityError
import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect

CATEGORY_ICONS = {
    'romantic': 'fa-heart',
    'wedding': 'fa-ring',
    'birthday': 'fa-birthday-cake',
    'business': 'fa-briefcase',
    'spring': 'fa-seedling',
    'luxury': 'fa-crown',
    'apology': 'fa-hand-peace',
    'thanks': 'fa-hands-helping',
    'congratulation': 'fa-glass-cheers',
    'just-because': 'fa-smile-wink',
}


def index(request):
    categories = Category.objects.all()
    popular_products = Products.objects.filter(is_available=True).order_by('-reviews_count')[:6]
    for category in categories: category.icon_class = CATEGORY_ICONS.get(category.slug, 'fa-bouquet')
    return render(request, 'flowwow/index.html', {'categories': categories, 'popular_products': popular_products})


def about(request): return render(request, 'flowwow/about.html')


def catalog(request):
    selected_slug = request.GET.get('category', 'all')
    search_query = request.GET.get('search', '').strip()
    categories = Category.objects.all()
    products = Products.objects.filter(is_available=True)
    if selected_slug != 'all': products = products.filter(category__slug=selected_slug)
    if search_query: products = products.filter(
        Q(name__icontains=search_query) | Q(short_description__icontains=search_query) | Q(
            description__icontains=search_query))
    return render(request, 'flowwow/catalog.html',
                  {'categories': categories, 'products': products, 'selected_category': selected_slug,
                   'search_query': search_query})


def product(request, product_slug):
    product_obj = Products.objects.filter(slug=product_slug, is_available=True).first()
    if not product_obj: return render(request, 'flowwow/product.html', {'product': None, 'reviews': []})
    reviews = product_obj.reviews.all().order_by('-created_at')
    return render(request, 'flowwow/product.html', {'product': product_obj, 'reviews': reviews})


def articles(request): return render(request, 'flowwow/articles.html',
                                     {'articles': Articles.objects.all().order_by('-date')})


def article(request, article_id):
    article_obj = Articles.objects.filter(id=article_id).first()
    return render(request, 'flowwow/article.html', {'article': article_obj})


def order(request): return render(request, 'flowwow/order.html', {'order': Order.objects.all()})


@require_POST
def user_login(request):
    try:
        data = json.loads(request.body)
        login_input = data.get('username', '').strip()
        password = data.get('password', '')

        if not login_input or not password:
            return JsonResponse({'error': 'Заполните все поля'}, status=400)

        # 1. Try standard username
        user = authenticate(username=login_input, password=password)

        # 2. Fallback: try email
        if user is None:
            from django.contrib.auth.models import User
            try:
                user_obj = User.objects.get(email=login_input)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user and user.is_active:
            login(request, user)
            return JsonResponse({'success': True, 'username': user.get_full_name() or user.username})

        return JsonResponse({'error': 'Неверный логин или пароль'}, status=401)
    except Exception as e:
        return JsonResponse({'error': 'Ошибка сервера'}, status=500)

@require_POST
def user_register(request):
    data = json.loads(request.body)
    if User.objects.filter(username=data.get('username')).exists():
        return JsonResponse({'error': 'Логин занят'}, status=400)
    user = User.objects.create_user(username=data['username'], email=data.get('email', ''), password=data['password'])
    login(request, user)
    return JsonResponse({'success': True, 'username': user.get_full_name() or user.username})


def user_logout(request):
    logout(request)
    return JsonResponse({'success': True})


@csrf_protect
@require_POST
def submit_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Требуется авторизация'}, status=401)

    try:
        data = json.loads(request.body)
        product = Products.objects.get(id=data['product_id'])

        if Review.objects.filter(product=product, user=request.user).exists():
            return JsonResponse({'error': 'Вы уже оставляли отзыв'}, status=400)

        review = Review.objects.create(
            product=product, user=request.user,
            rating=int(data['rating']), comment=data['comment'].strip()
        )

        return JsonResponse({
            'success': True,
            'review': {
                'author': request.user.get_full_name() or request.user.username,
                'rating': review.rating,
                'comment': review.comment,
                'date': review.created_at.strftime('%d.%m.%Y')
            }
        })
    except IntegrityError:
        # Catches the UNIQUE constraint cleanly instead of showing raw DB error
        return JsonResponse({'error': 'Вы уже оставляли отзыв на этот товар'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Ошибка сервера'}, status=500)


import traceback


@csrf_protect
@require_POST
def submit_order(request):
    try:
        data = json.loads(request.body)
        cart_items = data.get('cart_items', [])
        if not cart_items:
            return JsonResponse({'error': 'Корзина пуста'}, status=400)

        total = 0.0
        order_items = []

        for item in cart_items:
            pid = int(item.get('id', 0))
            qty = int(item.get('quantity', 1))
            price = float(item.get('price', 0))

            if not Products.objects.filter(id=pid).exists():
                return JsonResponse({'error': f'Товар ID {pid} не найден'}, status=400)

            order_items.append({
                'product_id': pid,
                'quantity': qty,
                'price': price
            })
            total += price * qty

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            total_price=total,
            delivery_address=data.get('address', ''),
            phone=data.get('phone', ''),
            email=data.get('email', ''),
            comment=f"Доставка: {data.get('date')} в {data.get('time')}\n{data.get('comment', '')}"
        )

        for oi in order_items:
            OrderItem.objects.create(order=order, **oi)

        return JsonResponse({'success': True, 'order_id': order.id})
    except Exception as e:
        # Prints EXACT error to your terminal so you know what broke
        print("❌ ORDER CRASH:", traceback.format_exc())
        return JsonResponse({'error': f'Ошибка оформления: {str(e)}'}, status=500)