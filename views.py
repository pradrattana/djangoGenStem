from django.http import HttpResponse
from django.shortcuts import render

def index(request):
  #return HttpResponse("Welcome")
  return render(request, 'projectPage.html')