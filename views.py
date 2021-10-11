from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, HttpResponse
from database.models import Member, MemberForm, Blog
from .forms import SigninForm
from django.db.models import Q
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader

def index(request):
  #return HttpResponse("Welcome")
  return render(request, 'index.html')

def member(request):
  if request.method == 'POST':
    form = MemberForm(request.POST)
    if form.is_valid():
      form.save()
  else:
    form = MemberForm()
  return render(request, 'member.html', { 'form': form })

def blog_read(request, id):
  blog = Blog.objects.get(id=id)
  return render(request, 'projectPage.html', { 'blog': blog })

def blog_write(request):
  if 'id' not in request.session:
    return redirect(reverse('member_signin'))
  
  name = request.session['name']
  username = request.session['username']
  if Member.objects.filter(Q(username=username) & Q(role='admin')).count() == 0:
    return redirect(reverse('member_signin'))
  """else:
    blog = Blog(writer=name, head='', body='', foot='')
    blog.save()"""

  err_msg = ''
  # AJAX
  if request.is_ajax():
    if request.method == 'POST':
      if request.POST.get('head', '') == '':
        err_msg = 'Please add blog title.'
      elif request.POST.get('body', '') == '':
        err_msg = 'Please add blog content.'
      elif request.POST.get('foot', '') == '':
        err_msg = 'Please add at least one blog tag.'
      else:
        blog = Blog(
          writer=name, 
          head = request.POST.get('head', ''),
          body = request.POST.get('body', ''),
          foot = request.POST.get('foot', '')
        )
        blog.save()
        """Blog.objects.filter(id=blog.id).update(
          writer = name,
          head = request.POST.get('head', ''),
          body = request.POST.get('body', ''),
          foot = request.POST.get('foot', '')
        )"""
      return JsonResponse({ 'err_msg': err_msg })
  
  return render(request, 'writePage.html', { 'err_msg': err_msg })




#ฟังก์ชันสำหรับตรวจสอบล็อกอินว่าซ้ำกับของคนอื่นหรือไม่
def check_key_exist(key, value):
  if key == 'email':
    row = Member.objects.filter(email=value)
  elif key == 'username':
    row = Member.objects.filter(username=value)
  if row.count() == 0:
    return False
  else:
    return True


def member_signup(request):
  # already log in, render homepage
  if 'id' in request.session:
    return redirect(reverse('member_home'))

  err_msg = None
  # AJAX
  if request.is_ajax():
    if request.GET.get('id', '') == 'id_username':
      exist = check_key_exist('username', request.GET.get('usr', ''))
      err_msg = 'Username already exists. Please try with another one.'
    elif request.GET.get('id', '') == 'id_email':
      exist = check_key_exist('email', request.GET.get('usr', ''))
      err_msg = 'Email already exists. Please try with another one.'
    return JsonResponse({ 'exist': exist, 'err_msg': err_msg })
  
  # POST
  if request.method == 'POST':
    form = MemberForm(request.POST)
    if form.is_valid():
      #ถ้าอีเมลไม่ซ้ำ ก็บันทึกข้อมูลลงในฐานข้อมูล
      if not (check_key_exist('email', request.POST['email']) \
          or check_key_exist('username', request.POST['username'])):
        r = form.save()  #หลังการบันทึก ให้เข้าสู่ระบบทันที
        request.session['id'] = r.id  #โดยเก็บข้อมูลบางอย่างไว้ในเซสชัน
        request.session['name'] = r.firstname
        request.session['username'] = r.username   
        return redirect(reverse('member_home'))
      action = reverse('member_signup')
    else:
      for field in form:
        if (field.errors):
          field.field.widget.attrs['style'] = "background-color: #FFE6E6"
      #form[list(form.errors)[0]].field.widget.attrs['style'] = "background-color: #FFE6E6"
      action = reverse('member_signup') 
        
  else:
    form = MemberForm()
    action = reverse('member_signup')

  #ฟังก์ชันและพาธนี้ ใช้สำหรับการรับข้อมูลเพื่อสมัครสมาชิกใหม่
  #ซึ่งเราต้องส่งพาธที่ใช้คู่กับฟังก์ชันนี้ไปยังเท็มเพลต
  #เพื่อกำหนดให้แก่แอตทริบิวต์ action ของฟอร์ม 
  return render(request, 'member-signup.html', { 'form': form, 'action': action })


@csrf_exempt # for use cookies with POST
def member_signin(request):
  # already log in, render homepage
  if 'id' in request.session:
    return redirect(reverse('member_home'))

  err_msg = None
  # POST
  if request.method == 'POST':
    form = SigninForm(request.POST)
    usr = request.POST.get('usr', '')
    password = request.POST.get('password', '')
    save = request.POST.get('save', False)

    if (usr.find('@') > -1):  # find username and password in database
      row = Member.objects.filter(Q(email=usr) & Q(password=password))
    else:
      row = Member.objects.filter(Q(username=usr) & Q(password=password))

    if row.count() == 1:  # if exists, save id and name in session
      request.session['id'] = row[0].id
      request.session['name'] = row[0].firstname
      request.session['username'] = row[0].username

      tmp = loader.get_template('member-home.html')
      data = { 'name': row[0].firstname }
      response = HttpResponse(tmp.render(data))  # send name for render in homepage

      if save:  # if checked 'remember me', save in cookies for 1 day
        age = 60*60*24
        response.set_cookie('usr', value=usr, max_age=age)
        response.set_cookie('password', value=password, max_age=age)
        response.set_cookie('save', value=save, max_age=age)
      else:  # else, delete from cookies
        response.delete_cookie('usr')
        response.delete_cookie('password')
        response.delete_cookie('save')

      return response
            
    else:
      err_msg = 'Incorrect username or password.'

  # COOKIES
  elif 'usr' in request.COOKIES:
    usr = request.COOKIES.get('usr', '')
    password = request.COOKIES.get('password', '')
    save = request.COOKIES.get('save', False)
    form = SigninForm(
      initial={ 'usr': usr, 'password': password, 'save': save }
    )

  else:
    form = SigninForm()
    
  return render(request, 'member-signin.html', { 'form': form, 'err_msg': err_msg })


def member_home(request):
  #ถ้ายังไม่มีค่า id ในเซสชัน แสดงว่ายังไม่เข้าสู่ระบบ
  #ก็ให้ย้ายไปที่เพจ การเข้าสู่ระบบ
  if 'id' not in request.session:
    return redirect(reverse('member_signin'))
    
  id = request.session['id']
  name = request.session['name']

  return render(request, 'member-home.html', { 'id': id, 'name': name })


def member_signout(request):
  if 'id' in request.session:
    del request.session['id']
    del request.session['name']
    del request.session['username']
        
  return redirect(reverse('member_signin'))


def member_resign(request):
  if 'id' in request.session:
    id = request.session['id']
    Member.objects.get(id=id).delete()
    del request.session['id']
    del request.session['name']
    del request.session['username']

  return redirect(reverse('index'))


def member_update(request):
  #ถ้าส่งข้อมูลเข้ามาแบบ AJAX
  #แสดงว่า ต้องการตรวจสอบอีเมลว่าซ้ำหรือไม่
  #เราสามารถเรียกฟังก์ชันที่สร้างไว้แล้วขึ้นมาใช้งานได้
  if request.is_ajax():
    if request.GET.get('email', ''):
      exist = check_key_exist('email', request.GET.get('email', ''))
    elif request.GET.get('username', ''):
      exist = check_key_exist('username', request.GET.get('username', ''))  
    return JsonResponse({ 'exist': exist })

  #ถ้าเปิดเพจนี้ โดยที่ยังไม่ได้เข้าสู่ระบบ ให้ไปที่เพจเข้าสู่ระบบ
  if 'id' not in request.session:
    return redirect(reverse('member_signin'))

  id = request.session['id']

  #ถ้าโพสต์ข้อมูลจากฟอร์มเข้ามา
  #เราก็นำไปอัปเดตหรือแทนที่ข้อมูลเดิมในแถวนั้น
  if request.method == 'POST':
    row = Member.objects.get(id=id)
    form = MemberForm(instance=row, data=request.POST)
    if form.is_valid():
      form.save()

      #เนื่องจากข้อมูลอาจถูกแก้ไข ดังนั้น เราควรอัปเดตค่าในเซสชันใหม่
      request.session['name'] = row.firstname
      request.session['username'] = row.username

    #ย้อนกลับไปยังเพจหลักของสมาชิก    
    return redirect(reverse('member_home'))

  #ถ้าเป็นการเปิดเพจเพื่อแก้ไขข้อมูล ให้อ่านข้อมูลเดิมในแถวนั้น
  #แล้วนำไปกำหนดเป็นค่าเริ่มต้นให้กับฟอร์ม
  #ซึ่งสมาชิกสามารถเลือกแก้ไขเฉพาะฟิลด์ที่ต้องการ
  #ส่วนฟิลด์ที่ไม่ได้แก้ไข ก็ยังเป็นค่าเดิม
  else:
    row = Member.objects.get(id=id)
    form = MemberForm(initial=row.__dict__)
    action = reverse('member_update')
    err_msg = ''

  return render(request, 'member-signup.html', {'form': form, 'action':action, 'err_msg':err_msg})
