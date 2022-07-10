from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import accountsDB
from Logbook.models import accountsDB, unitsDB, billsDB, historyDB

class updateForm(forms.ModelForm):

    class Meta:
        model=accountsDB
        fields = ['first_name','last_name','email','gender','bday','occu','contact','prop_type','unit_no']
        widgets = {
            'first_name': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'First Name'
                    }
            ),
            'last_name': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'Last Name'
                    }
            ),
            'gender': forms.Select(
                attrs={
                    'class': 'form-control'
                }
            ),
            'bday': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'type':'date'
                    }
            ),
            'occu': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder':'Occupation'
                }
            ),
            'contact': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'placeholder':'Contract No:'
                    }
                ),
            'email': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder':'Email'
                    }
                ),
            'unit_no': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'placeholder':'Unit #'
                }
            ),
            'prop_type': forms.Select(
                attrs={
                    'class': 'form-control'
                }
            )
        } 
   

class regForm(UserCreationForm):
    password1 = forms.CharField(
        max_length=30, widget=forms.PasswordInput(
            attrs={
                    'class': 'form-control',
                    'placeholder':'Password'
					}
                )
            )
    password2 = forms.CharField(
        max_length=30, widget=forms.PasswordInput(
            attrs={
                    'class': 'form-control',
                    'placeholder':'Confirm Password'
					}
                )
            )
    class Meta:
        model=accountsDB
        fields = ['username','password1','password2', 'bday']
        widgets = {
            'username': forms.TextInput(
				attrs={
                    'class': 'form-control',
                    'placeholder':'Username'
					}
				),
            'bday': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'type':'date'
                    }
            ),
        }

class changeForm(UserCreationForm):
    password1 = forms.CharField(
        max_length=30, widget=forms.PasswordInput(
            attrs={
                    'class': 'form-control',
                    'placeholder':'Password'
					}
                )
            )
    password2 = forms.CharField(
        max_length=30, widget=forms.PasswordInput(
            attrs={
                    'class': 'form-control',
                    'placeholder':'Confirm Password'
					}
                )
            )
    class Meta:
        model=accountsDB
        fields = ['username','password1','password2']
        widgets = {
            'username': forms.TextInput(
				attrs={
                    'class': 'form-control',
                    'placeholder':'Username'
					}
				),
        }

class newForm(UserCreationForm):
    password1 = forms.CharField(
        max_length=30, widget=forms.PasswordInput(
            attrs={
                    'class': 'form-control',
                    'placeholder':'Password'
					}
                )
            )
    password2 = forms.CharField(
        max_length=30, widget=forms.PasswordInput(
            attrs={
                    'class': 'form-control',
                    'placeholder':'Confirm Password'
					}
                )
            )
    class Meta:
        model=accountsDB
        fields = ['username','password1','password2','first_name','last_name','email','gender','bday','occu','contact','unit_no','prop_type']
        widgets = {
                'first_name': forms.TextInput(
                    attrs={
                        'class': 'form-control',
                        'placeholder': 'First Name'
                        }
                ),
                'last_name': forms.TextInput(
                    attrs={
                        'class': 'form-control',
                        'placeholder': 'Last Name'
                        }
                ),
                'gender': forms.Select(
                    attrs={
                        'class': 'form-control'
                    }
                ),
                'bday': forms.NumberInput(
                    attrs={
                        'class': 'form-control',
                        'type':'date'
                        }
                ),
                'occu': forms.TextInput(
                    attrs={
                        'class': 'form-control',
                        'placeholder':'Occupation'
                    }
                ),
                'contact': forms.NumberInput(
                    attrs={
                        'class': 'form-control',
                        'placeholder':'Contract No:'
                        }
                    ),
                'email': forms.TextInput(
                    attrs={
                        'class': 'form-control',
                        'placeholder':'Email'
                        }
                    ),
                'username': forms.TextInput(
                    attrs={
                        'class': 'form-control',
                        'placeholder':'Username'
                        }
                    ),
                'unit_no': forms.NumberInput(
                    attrs={
                        'class': 'form-control',
                        'placeholder':'Unit #'
                    }
                ),
                'prop_type': forms.Select(
                    attrs={
                        'class': 'form-control'
                    }
                )
            } 


class billsForm(forms.ModelForm):
    class Meta:
        model = billsDB
        fields = ['date','balance']
        widgets = {
            'date': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'type':'date'
                }
            ),
            'balance': forms.NumberInput(
				attrs={
                    'class': 'form-control'
					}
				)
        }
        
class payForm(forms.ModelForm):
    class Meta:
        model = billsDB
        fields = ['balance']
        widgets = {
            'balance': forms.NumberInput(
                attrs={
                    'class':'form-control'
                }
            )
        }

class historyForm(forms.ModelForm):
    class Meta:
        model = historyDB
        fields = '__all__'