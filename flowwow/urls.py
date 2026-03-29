from django.urls import path
from . import views
from .views import catalog

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('catalog/', views.catalog, name='catalog'),
    path('articles/', views.articles, name='articles'),
    #path('catalog/', include('flowers.urls')),
]
