from django.urls import path, include
from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    error_view,
    HomeView,
    AboutView,
    contact_us_view,
    get_agent
)

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('error/', error_view, name='error'),
    path('about/', AboutView.as_view(), name='about'),
    path('contact-us/', contact_us_view, name='contact-us'),
    ## wagtail urls
    path('cms/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
    path('pages/', include(wagtail_urls)),
    ## DRF
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/page/<int:page_id>/agent', get_agent, name='get_agent'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)