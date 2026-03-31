from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
import json
from .models import Category, Products, Articles, Order, Review

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


# 📝 REVIEW VIEW
@csrf_protect
@require_POST
def submit_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Необходима авторизация'}, status=401)

    data = json.loads(request.body)
    try:
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
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)