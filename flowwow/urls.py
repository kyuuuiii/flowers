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
    path('order/', views.order, name='order'),

    path('auth/login/', views.user_login, name='login'),
    path('auth/register/', views.user_register, name='register'),
    path('auth/logout/', views.user_logout, name='logout'),
    path('review/submit/', views.submit_review, name='submit_review'),
]
