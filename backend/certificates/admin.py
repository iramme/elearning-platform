from django.contrib import admin
from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'certificate_code', 'pdf_url', 'issued_at')
    list_filter = ('issued_at',)
    search_fields = ('student__username', 'course__title')