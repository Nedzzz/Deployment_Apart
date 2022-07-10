from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('register/', views.new_reg, name='register'),
    path('profile/<int:id>', views.profile, name='profile'),
    path('history/', views.history, name='history'),
    path('payment/<int:id>', views.payment, name='payment'),
    path('tenant/', views.tenant, name='tenant'),
    path('receipt/<int:id>', views.receipt, name='receipt'),
    path('payupdate/<int:id>', views.paymentUpdate, name='payupdate'),
    path('profileUpdate/<int:id>', views.profUpdate, name='profUpdate'),
    path('profileDelete/<int:id>', views.profDelete, name='profiled'),
    path('addtenant/', views.addtenant, name='addtenant'),
    path('addbills/<int:id>', views.addbills, name='addbills'),
    path('newtenant/', views.new_reg, name='newtenant'),
    path('reglandlord/', views.reglandlord, name='reglandlord'),
    path('logout/', views.logoutUser, name='logoutUser'),
    path('removebill/<int:id>', views.removebill, name='removebill'),
    path('receipt_PDF/<int:id>', views.receipt_pdf, name='receipt_pdf'),

   
]