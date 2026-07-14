from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'amount', 'status', 'created_at', 'paid_at')
    list_filter = ('status',)
    search_fields = ('student__username', 'course__title')