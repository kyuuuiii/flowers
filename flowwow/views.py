from django.shortcuts import render

# Create your views here.
from .models import Category, Products, Articles

def index(request):
    categories = Category.objects.all()
    popular_products = Products.objects.filter(is_available=True).order_by('-reviews_count')[:6]
    context = {
        'categories': categories,
        'popular_products': popular_products,
    }
    return render(request, 'flowwow/index.html', context)

def about(request):
    return render(request, 'flowwow/about.html')

def catalog(request):
    selected_slug = request.GET.get('category', 'all')

    categories = Category.objects.all()

    products = Products.objects.filter(is_available=True)
    if selected_slug != 'all':
        products = products.filter(category__slug=selected_slug)

    context = {
        'categories': categories,
        'products': products,
        'selected_category': selected_slug,
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


