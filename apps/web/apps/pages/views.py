from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from wagtail.models import Page

from .forms import ContactForm


# Create your views here.

class HomeView(TemplateView):
    template_name = 'pages/home.html'


class AboutView(TemplateView):
    template_name = 'pages/about_us.html'


# class ContactUsView(TemplateView):
#     template_name = 'pages/contact_us.html'

def contact_us_view(request):
    form = ContactForm(request.POST or None)
    context = {
        'form': form,
    }
    if form.is_valid():
        form.save()
        return redirect('/')
    return render(request, 'pages/contact_us.html', context=context)


def error_view(request, exception=None):
    return render(request, 'pages/error.html', status=404)

from django.http import JsonResponse
import os

import requests


def call_mistral_api(agent_id, query_string, mistral_api_key):

  url = "https://api.mistral.ai/v1/agents/completions"
  headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": f"Bearer {mistral_api_key}"
  }
  data = {
      "agent_id": agent_id,
      "messages": [{"role": "user", "content": query_string}]
  }

  response = requests.post(url, headers=headers, json=data)
  response.raise_for_status()  # Raise an exception for bad status codes
  return response.json()

# Example usage
agent_id = "ag:241bf8b8:20241022:untitled-agent:b9feae54" 
query = "Introduce yourself "
api_key = os.environ["MISTRAL_API_KEY"]


def get_agent(request, page_id):
    # 1. Get the page (assuming you have a Page model)
    try:
        page = Page.objects.get(pk=page_id) 
    except Page.DoesNotExist:
        return JsonResponse({'error': 'Page not found'}, status=404)
    print(Page)
    response_json = call_mistral_api(agent_id, query, api_key)

    return JsonResponse(response_json)