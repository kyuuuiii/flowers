from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

def index(request):
    return render(request, 'flowwow/index.html')

def about(request):
    return HttpResponse("abouy")

def catalog(request):
    return HttpResponse("catalog")

def cart(request):
    return HttpResponse("cart")

