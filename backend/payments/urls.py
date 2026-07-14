from django.urls import path
from .views import CreateCheckoutSessionView, MyOrdersView, stripe_webhook

urlpatterns = [
    path('checkout/<int:course_id>/', CreateCheckoutSessionView.as_view(), name='checkout'),
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]