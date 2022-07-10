from asyncio.windows_events import NULL
from calendar import month
from mmap import PAGESIZE
from multiprocessing import context
from operator import truediv
import re
from time import strftime
from tkinter import N
from turtle import update
from django.shortcuts import render,redirect
from django.http import HttpResponseForbidden
from django.contrib.auth.forms import UserCreationForm
from Logbook.models import historyDB, accountsDB, unitsDB, billsDB, testDB
from Logbook.forms import historyForm, payForm, billsForm, regForm, newForm, updateForm, changeForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import datetime
from json import dumps
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import get_template
from myProject.settings import EMAIL_HOST_USER

import io
from reportlab.lib.units import inch
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import os.path

def reglandlord(request):
    if request.method == "POST":
        form = regForm(request.POST)
        if form.is_valid():
            form.save()
            total = request.POST.get('units')
            for x in range(int(total)):
                x += 1
                units = unitsDB.objects.create(unit_no=x)
            return redirect('/Logbook/')
        else:
            print(form.errors.as_data())
            messages.error(request,'Invalid, Please Try Again')
    else:
        form = regForm()
    return render(request, 'activities/reglandlord.html', {'form':form})

def logoutUser(request):
    logout(request)
    return redirect('index')

def index(request):
    empty = accountsDB.objects.all()
    if unitsDB.objects.all().exists():
        ex = 'yes'
    else:
        ex = 'no'
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None and user.prop_type is None:
            login(request, user)
            return redirect('home')
        elif user is not None and user.prop_type is not None:
            login(request, user)
            
            return redirect('tenant')
        else:
            messages.error(request,'Invalid Credentials, Please Try Again')
            return redirect('index')
    return render(request, 'activities/blogin.html',{'ex':ex})

@login_required(login_url='index')
def home(request):
    if request.user.is_authenticated and request.user.prop_type is None:
        x = datetime.datetime.now()
        month = x.strftime("%Y""-""%m""-""01")
        if not billsDB.objects.filter(date=month).exists():
            accounts = accountsDB.objects.exclude(unit_no__isnull=True)
            for acc in accounts:
                if acc.prop_type == '1':
                    amount = '5000'
                else:
                    amount = '8000'
                #create bill
                newBill = billsDB.objects.create(tenant_id_id=acc.id, date=month, balance=amount)
                newBill.save()
                #update total balance
                bills_add = billsDB.objects.filter(tenant_id_id=acc.id)
                newtotal = 0
                for b in bills_add:
                    newtotal += int(b.balance)
                account = accountsDB.objects.get(id=acc.id)
                account.total_balance = newtotal
                account.save()
        tens = accountsDB.objects.exclude(unit_no = None)
        return render(request,"activities/bmain.html",{'tens':tens}) 
    else:
        return redirect('index')
        
@login_required(login_url='index')
def new_reg(request):
    if request.user.is_authenticated and request.user.prop_type is None:
        
        if request.method == "POST":
            form = newForm(request.POST)
            if form.is_valid():
                #data needed
                today = datetime.datetime.now()
                date = str(today.year)+'-'+str(today.strftime("%m"))+'-'+ str('01')
                unit = (request.POST["unit_no"])
                prop = (request.POST['prop_type'])
                idi = accountsDB.objects.latest('id')
                if prop=='1':
                    amount = 5000
                elif prop=='2':
                    amount = 8000
                unitData = unitsDB.objects.get(unit_no=unit)
                if unitData.status != 'O':
                    #save tenant info
                    form.save()
                    #update unit status
                    unitData.status = 'O'
                    unitData.save()
                    #create bill
                    newBill = billsDB.objects.create(tenant_id=idi, date=date, balance=0)
                    newBill.save()
                    #create history
                    id_bill = billsDB.objects.latest('bill_id')
                    newRecord = historyDB.objects.create(pay_for=date, amount=amount,unit_no=unit,prop_type=prop,bill_id_id=id_bill.bill_id)
                    newRecord.save()
                    print(date)
                    #send email
                    fname = request.POST['first_name']
                    lname = request.POST['last_name']
                    #name = fname + ' ' + lname            
                    email = request.POST['email']    
                    user = request.POST['username']
                    passw = request.POST['password1']
                    #send_mail(
                        #subject='Registration Successfully',
                        #message="Good Day "+ name +"! \nThis email was used to make an account for Crisostomo Compound's Apartment Management System. \nWe will send updates like recent payments, new bills, and overdue bills to this email address.\n  \nLogin Information \nUsername: " + user +"\nPassword: "+ passw +"\n \nTo access the website, please click the link below and login. \nhttp://127.0.0.1:8000/Logbook/ \n  \nThank you very much \n-Landlord",
                        #from_email='Crisostomo Compound '+settings.EMAIL_HOST_USER,
                        #recipient_list=[email],
                        #fail_silently=False
                    #)
                    context = {
                        'first_name': fname,
                        'last_name': lname,
                        'username': user,
                        'password1': passw
                        
                    }
                    with open(str(settings.BASE_DIR) + "/Logbook/templates/activities/register_email.html") as template:
                        register_message = template.read()
                        message = EmailMultiAlternatives(subject='Registration Successful', body=register_message, from_email='Crisostomo Compound', to=[email])
                        register_template = get_template('activities/register_email.html').render(context)
                        message.attach_alternative(register_template, 'text/html')
                        message.send()
                    return redirect('/Logbook/home/')
                else:
                    print(form.errors.as_data())
                    messages.error(request,'Unit is Occupied')       
            else:
                print(form.errors.as_data())
                messages.error(request,'Invalid, Please Try Again')
        else:
            
            form = newForm()
        context = {
            'form':form
        }
        return render(request, 'activities/newreg.html', context)
    else:
        return redirect('index')

def addtenant(request):
    if request.user.is_authenticated and request.user.prop_type is None:
        if request.method == "POST":
            form = newForm(request.POST)
            if form.is_valid():
                unit = (request.POST["unit_no"])
                unitData = unitsDB.objects.get(unit_no=unit)
                if unitData.status != 'O':
                    #save tenant info
                    form.save()
                    #update unit status
                    
                    unitData.status = 'O'
                    unitData.save()
                    tenant = accountsDB.objects.latest('id')
                    #send email
                    fname = request.POST['first_name']
                    lname = request.POST['last_name']        
                    email = request.POST['email']    
                    user = request.POST['username']
                    passw = request.POST['password1']
                    pass2 = request.POST['password2']

                    context = {
                        'first_name': fname,
                        'last_name': lname,
                        'username': user,
                        'password1': passw 
                    }
                    
                    with open(str(settings.BASE_DIR) + "/Logbook/templates/activities/register_email.html") as template:
                        register_message = template.read()
                        message = EmailMultiAlternatives(subject='Registration Successful', body=register_message, from_email='Crisostomo Compound', to=[email])
                        register_template = get_template('activities/register_email.html').render(context)
                        message.attach_alternative(register_template, 'text/html')
                        message.send()
                
                    return redirect('/Logbook/addbills/'+str(tenant.pk))
                else:
                    print(form.errors.as_data())
                    messages.error(request,'Unit is Occupied')
            else:
                print(form.errors.as_data())
                messages.error(request,'Invalid, Please Try Again')
        else:  
            form = newForm() 
        return render(request,'activities/regtenant.html',{'form':form})  
    else:
        return redirect('index')

@login_required(login_url='index')
def addbills(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:
        prof = accountsDB.objects.get(id=id)
        bills = billsDB.objects.filter(tenant_id_id=id)
        if request.method == 'POST':
            billform = billsForm(request.POST)
            try:  
                max_bill_id = billsDB.objects.latest('bill_id')
                new_id = max_bill_id.bill_id+1    
            except:
                new_id = 1
            tenant_id_id = id
            balance = request.POST['balance']
            date = request.POST['date']
            bill_id = new_id
            new_bill = billsDB(tenant_id_id=tenant_id_id,date=date,balance=balance,bill_id=bill_id)
            new_bill.save()
            #update total balance
            bills_add = billsDB.objects.filter(tenant_id_id=id)
            newtotal = 0
            for x in bills_add:
                newtotal += int(x.balance)
            account = accountsDB.objects.get(id=id)
            account.total_balance = newtotal
            account.save()
            return redirect('/Logbook/addbills/'+str(id))
        else:
            billform = billsForm()
        return render(request,'activities/regbills.html', {'billform':billform, 'prof':prof, 'bills':bills})
    else:
        return redirect('index')
@login_required(login_url='index')
def removebill(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:
        bill = billsDB.objects.get(bill_id=id)
        account = bill.tenant_id_id
        tenant = accountsDB.objects.get(id=account)
        if request.method == "POST":
            #delete bill
            messages.success(request,'Bill '+str(bill.date)+' Removed')
            bill.delete()
            #update total balance
            bills = billsDB.objects.filter(tenant_id_id=account)
            total = 0
            for x in bills:
                total += int(x.balance)
            tenant.total_balance = total
            tenant.save()
            
            return redirect('/Logbook/addbills/'+str(account))
        return render(request,'activities/removebill.html', {'bill':bill})

@login_required(login_url='index')
def profile(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:
    
    
        prof = accountsDB.objects.get(id=id)
        bills = billsDB.objects.filter(tenant_id_id=id).exclude(balance='0')
        forms = updateForm(instance=prof) 
        return render(request, 'activities/bprofile.html',{'prof':prof,'bills':bills,'forms':forms})
    else:
        return redirect('index')

@login_required(login_url='index')
def profUpdate(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:
        prof = accountsDB.objects.get(id=id)
        print(prof.unit_no)
        unitex = prof.unit_no
        forms = updateForm(instance=prof)
        if request.method == "POST":
            forms = updateForm(request.POST, instance=prof)
            if forms.is_valid():  
                
                unitAvail = unitsDB.objects.get(unit_no=unitex)
                unitAvail.status = 'A'
                unitAvail.save()
                print(prof.unit_no)
                forms.save()  
                print("valid")
                unit = request.POST["unit_no"]
                print(unit)
                unitData = unitsDB.objects.get(unit_no=unit)
                unitData.status = 'O'
                unitData.save()
            

                return redirect("/Logbook/home/")
            else:
                print(forms.errors.as_data())
                messages.error(request,'Invalid, Please Try Again')   
        return render(request, 'activities/bprofile.html',{'prof':prof, 'forms':forms})
    else:
        return redirect('index')

@login_required(login_url='index')    
def profDelete(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:
        proff = accountsDB.objects.get(id=id)
        print(proff)
        unitData = unitsDB.objects.get(unit_no=proff.unit_no)
        unitData.status = 'A'
        unitData.save()
        proff.unit_no = None
        proff.save()
        #proff.delete()
        return redirect("/Logbook/home/")
    else:
        return redirect('index')

@login_required(login_url='index')
def history(request):
    if request.user.is_authenticated and request.user.prop_type is None:
        if request.method == 'POST':
            date = request.POST.get('mselect')
            print(date)
            hist = historyDB.objects.filter(pay_for=date)
            tmonth = 0
            for x in hist:
                tmonth += x.amount
            print(tmonth)
            totalm = "Monthly Income: " + str(tmonth)
            yeardate = date[0:4]
            yeartotal = historyDB.objects.filter(pay_for__startswith=yeardate)
            tyear = 0
            for y in yeartotal:
                tyear += y.amount
            print(tyear)
            totaly = "Yearly Income: " +str(tyear)
            
        else:
            hist = historyDB.objects.select_related('bill_id__tenant_id').all()
            totalm = "Please select a Date"
            totaly = "Please select a Date"
        return render(request, 'activities/bhis.html', {'hist':hist, 'totalm':totalm, 'totaly':totaly})

    else:
        return redirect('index')



@login_required(login_url='index')
def payment(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:
        bill = billsDB.objects.get(bill_id=id)
        return render(request, 'activities/bpay.html',{'bill':bill})
    else:
        return redirect('index')
    
@login_required(login_url='index')
def paymentUpdate(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:
        bill = billsDB.objects.get(bill_id=id)
        form = payForm(request.POST, instance= bill)
        if form.is_valid():
            form.save()
            #update total balance
            bills_add = billsDB.objects.filter(tenant_id_id=bill.tenant_id_id)
            newtotal = 0
            for x in bills_add:
                newtotal += int(x.balance)
            account = accountsDB.objects.get(id=bill.tenant_id_id)
            account.total_balance = newtotal
            account.save()
            #create history
            acc = accountsDB.objects.get(id=bill.tenant_id_id)
            date = bill.date
            amount = request.POST.get('amount')
            unit = acc.unit_no
            prop = acc.prop_type
            id_bill = bill.bill_id
            newRecord = historyDB.objects.create(pay_for=date, amount=amount,unit_no=unit,prop_type=prop,bill_id_id=id_bill)
            newRecord.save()
            #send email
            latest = historyDB.objects.latest('history_id')
            datetime = latest.date
            balance = newtotal
            subcode = 'H'+str(latest.history_id)+'B'+str(latest.bill_id_id)
            sub = 'Payment Record '+subcode
            receiver = []
            receiver.append(str(account.email))
            context = {
                'datetime': datetime,
                'date': date,
                'amount': amount,
                'balance': balance,
                'tenant': account
            }
            with open(str(settings.BASE_DIR) + "/Logbook/templates/activities/payment_email.html") as template:
                payment_message = template.read()
                message = EmailMultiAlternatives(subject=sub, body=payment_message, from_email='Crisostomo Compound', to=receiver)
                payment_template = get_template('activities/payment_email.html').render(context)
                message.attach_alternative(payment_template, 'text/html')
                message.send()
            return redirect("/Logbook/home/")  
        return render(request, 'activities/bpay.html', {'bill': bill,'form':form})  
    else:
        return redirect('index')

@login_required(login_url='index')
def tenant(request):
    if request.user.is_authenticated and request.user.prop_type is not None:
        users = accountsDB.objects.get(id=request.user.id)
        bills = billsDB.objects.filter(tenant_id_id=request.user.id).exclude(balance='0')
        forms = updateForm(instance=users) 
        paidbills = billsDB.objects.filter(tenant_id=users.id).filter(balance__in=['0','2500','4000'])
        idlist = []
        for x in paidbills:
            idlist.append(x.bill_id)
        print(idlist)
        hist = historyDB.objects.filter(bill_id_id__in=idlist)
        return render(request, 'activities/btenant.html',{'bills':bills, 'users':users, 'forms':forms, 'hist':hist})
       
    else:
        return redirect('index')
    
@login_required(login_url='index')
def receipt(request,id):
    if request.user.is_authenticated and request.user.prop_type is None:    
        rcpt = historyDB.objects.filter(history_id=id)
        return render(request, 'activities/receipt.html', {'rcpt':rcpt})
    else:
        return redirect('index')

def receipt_pdf(request,id):
    if request.user.is_authenticated:    
        rcpt = historyDB.objects.get(history_id=id)
        name = rcpt.bill_id.tenant_id.first_name + " " + rcpt.bill_id.tenant_id.last_name
        unit = rcpt.unit_no
        prop = rcpt.prop_type
        dates = rcpt.date.strftime("%B %d %Y, %I:%M %p")
        payfor = rcpt.pay_for.strftime("%B %d %Y")
        amount = rcpt.amount

        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=letter, bottomup=0)
        img = ImageReader(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'signature.png'))
        
        c.setPageSize((600,325))
        c.setFont("Times-Roman", 24)
        c.drawString(240, 50, "Receipt # "+ 'H'+str(rcpt.history_id)+'B'+str(rcpt.bill_id_id))
        c.setFont("Times-Roman", 16)
        c.drawString(50, 100, "Name: "+ str(name))
        c.drawString(50, 125, "Unit No. " + str(unit))
        c.drawString(50, 150, "Property Type: " + str(prop) + " Bedroom")
        c.drawString(50, 175, "Date: " + str(dates))
        c.drawString(50, 200, "Payment For: " + str(payfor))
        c.drawString(50, 225, "Amount: " + str(amount))
        c.line(400, 240, 550, 240)
        c.drawString(445, 260, "Signature" )
        c.drawImage(img, 400, 180, width=150, height=100, mask='auto')
        
        c.showPage()
        c.save()
        buf.seek(0)

        return FileResponse(buf, as_attachment=False, filename="receipt.pdf")
    else:
        return redirect('index')



