from django.shortcuts import render
from django.db.models import Q

# Create your views here.
from .models import Category, Products, Articles, Order

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
    for category in categories:
        category.icon_class = CATEGORY_ICONS.get(category.slug, 'fa-bouquet')
    context = {
        'categories': categories,
        'popular_products': popular_products,
    }
    return render(request, 'flowwow/index.html', context)


def about(request):
    return render(request, 'flowwow/about.html')

def catalog(request):
    selected_slug = request.GET.get('category', 'all')
    search_query = request.GET.get('search', '').strip()

    categories = Category.objects.all()

    products = Products.objects.filter(is_available=True)
    if selected_slug != 'all':
        products = products.filter(category__slug=selected_slug)

    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(short_description__icontains=search_query) |
            Q(description__icontains=search_query)
        )

    context = {
        'categories': categories,
        'products': products,
        'selected_category': selected_slug,
        'search_query': search_query,
    }
    return render(request, 'flowwow/catalog.html', context)

def product(request, product_slug):
    product_obj = Products.objects.filter(slug=product_slug, is_available=True).first()
    if not product_obj:
        return render(request, 'flowwow/product.html', {'product': None, 'reviews': []})

    reviews = product_obj.reviews.all()
    context = {
        'product': product_obj,
        'reviews': reviews,
    }
    return render(request, 'flowwow/product.html', context)


def articles(request):
    articles = Articles.objects.all().order_by('-date')
    context = {
        'articles': articles,
    }
    return render(request, 'flowwow/articles.html', context)

def article(request, article_id):
    article_obj = Articles.objects.filter(id=article_id).first()
    if not article_obj:
        return render(request, 'flowwow/article.html', {'article': None})

    context = {
        'article': article_obj,
    }
    return render(request, 'flowwow/article.html', context)

def order(request):
    order = Order.objects.all()
    context = {
        'order': order,
    }

    return render(request, 'flowwow/order.html', context)
