from django import forms

class SigninForm(forms.Form):
  usr = forms.CharField(
    label = 'Username / Email'
  )
  password = forms.CharField(
    label = 'Password', 
    widget = forms.PasswordInput(render_value=True)
  )
  save = forms.BooleanField(
    label = 'Remember me', 
    required = False
  )