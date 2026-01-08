from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """
    Extends the basic User model to add game stats and preferences.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=50, default='USA')
    currency = models.CharField(max_length=10, default='USD')
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    next_level_xp = models.IntegerField(default=1000)
    streak = models.IntegerField(default=0)
    budget_limit = models.DecimalField(max_digits=12, decimal_places=2, default=2000.00)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Transaction(models.Model):
    TRANSACTION_TYPES = [('income', 'Income'), ('expense', 'Expense')]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=100)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.amount})"

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    cycle = models.CharField(max_length=50) # e.g., 'Monthly'
    next_date = models.DateField()
    logo = models.CharField(max_length=500, blank=True) # URL or Initial

    def __str__(self):
        return self.name

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    name = models.CharField(max_length=200)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    icon = models.CharField(max_length=10, default='🎯')

    def __str__(self):
        return self.name