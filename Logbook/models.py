from django.db import models
from django.db.models import Model
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

GENDER_CHOICES = (
    ('M', 'Male'),
    ('F', 'Female'),
)
PROP_CHOICES = (
    ('1', '1 Bedroom'),
    ('2', '2 Bedroom'),
)

class unitsDB(models.Model):
    unit_no = models.IntegerField(primary_key=True)
    status = models.CharField(max_length=1, default='A') 
    class Meta:
        db_table = "logbook_unitsDB"

class accountsDB(AbstractUser):
    gender = models.CharField(max_length=10, choices = GENDER_CHOICES)
    bday = models.DateField(max_length=10)
    occu = models.CharField(max_length=50, null=True, blank=True)
    contact = models.CharField(max_length=20, null=True, blank=True)
    unit_no = models.IntegerField(null=True, blank=True)
    prop_type = models.CharField(max_length=1, choices=PROP_CHOICES, null=True, blank=True)
    total_balance = models.IntegerField(default=0)

class billsDB(models.Model):
    date = models.DateField(max_length=20)
    balance = models.IntegerField()
    bill_id = models.AutoField(primary_key=True)
    tenant_id = models.ForeignKey(accountsDB, on_delete=models.RESTRICT)
    class Meta:
        db_table = "logbook_billsDB"

class historyDB(models.Model):
    date = models.DateTimeField(default=timezone.now)
    pay_for = models.DateField(max_length=20)
    amount = models.IntegerField()
    unit_no = models.IntegerField()
    prop_type = models.CharField(max_length=20)
    bill_id = models.ForeignKey(billsDB, on_delete=models.RESTRICT)
    history_id = models.AutoField(primary_key=True)
    class Meta:
        db_table = "logbook_historyDB"

class testDB(models.Model):
    auto_date = models.DateTimeField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    now_date = models.DateTimeField(default=timezone.now)
    test_name = models.CharField(max_length=10)