"""djangoGenStem URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
  path('admin/', admin.site.urls),

  path('', views.index, name='index'),
  path('blog/draft/', views.blog_write, name='blog_write'),
  re_path('^blog/(?P<id>[0-9a-f-]+)/', views.blog_read, name='blog_read'),

  path('member/signup/', views.member_signup, name='member_signup'),
  path('member/signin/', views.member_signin, name='member_signin'),
  path('member/', views.member_home, name='member_home'),
  path('member/signout/', views.member_signout, name='member_signout'),
  path('member/resign/', views.member_resign, name='member_resign'),
  path('member/update/', views.member_update, name='member_update'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)