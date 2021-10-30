from django.db import models
from django import forms
from django.utils import timezone
import uuid

# Create your models here.
class Member(models.Model):
  firstname = models.CharField(max_length=30)
  lastname = models.CharField(max_length=30)
  username = models.CharField(unique=True, max_length=30)
  email = models.EmailField(unique=True)
  password = models.CharField(max_length=20)
  role = models.CharField(blank=True, max_length=20)

  def __str__(self):
    return f'{self.firstname} | {self.lastname} | {self.username} | {self.email} | {self.password}'

class MemberForm(forms.ModelForm):
  confirm_pswd = forms.CharField(
    label = 'Confirm Password', 
    widget = forms.PasswordInput()
  )
  
  class Meta:
    model = Member
    fields = '__all__'
    exclude = ['role']
    labels = {
      'firstname': 'First name',
      'lastname': 'Last name',
      'username': 'Username',
      'email': 'Email',
      'password': 'Password',
    }
    widgets = {
      'password': forms.PasswordInput(render_value=True),
    }
    error_messages = {
      'username': {
        'unique': "Username already exists. Please try with another one.",
      },
      'email': {
        'unique': "Email already exists. Please try with another one.",
      },
    }


class Blog(models.Model):
  id = models.UUIDField(
    primary_key=True, 
    default=uuid.uuid4, 
    editable=False
  )
  date = models.DateTimeField(default=timezone.now)
  writer = models.CharField(max_length=30)
  head = models.TextField()
  body = models.TextField()
  foot = models.TextField()

  def __str__(self):
    return f'{self.id} | {self.date} | {self.writer} | {self.head}'
