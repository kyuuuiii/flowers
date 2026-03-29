from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

def index(request):
    return render(request, 'flowwow/index.html')

def about(request):
    return render(request, 'flowwow/about.html')

def catalog(request):
    return render(request, 'flowwow/catalog.html')

def articles(request):
    return render(request, 'flowwow/articles.html')


