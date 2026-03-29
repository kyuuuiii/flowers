from django.urls import path
from . import views
from .views import catalog

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('catalog/', views.catalog, name='catalog'),
    path('product/<slug:product_slug>/', views.product, name='product'),
    path('articles/', views.articles, name='articles'),
    path('article/<int:article_id>/', views.article, name='article'),
    #path('catalog/', include('flowers.urls')),
]
