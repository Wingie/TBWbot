from django.db import models

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail import blocks
from wagtail.admin.panels import FieldPanel
from wagtail.images.blocks import ImageChooserBlock
from wagtail.search import index


class BlogPage(Page):
    date = models.DateField("Post date")
    intro = models.CharField(max_length=250)
    author = models.CharField(max_length=255)

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
        index.SearchField('body'),
    ]
    body = StreamField([
        ('heading', blocks.CharBlock(form_classname="title")),
        ('paragraph', blocks.RichTextBlock(required=False)),
        ('image', ImageChooserBlock(required=False)),
    ])

    content_panels = Page.content_panels + [
        FieldPanel('author'),
        FieldPanel('date'),
        FieldPanel('intro'),
        FieldPanel('body'),
    ]


class DinnerPage(Page):
    dinner_coordinator = models.CharField(max_length=255)
    date = models.DateField("event date")
    food = StreamField([
        ('pickup', blocks.RichTextBlock(form_classname="add details about the pickup food in the morning",required=False)),
        ('recipie', blocks.RichTextBlock(form_classname="add details about the dinner guests",required=False)),
        ('todos', blocks.RichTextBlock(form_classname="add details about the dinner guests",required=False)),
        ('images', ImageChooserBlock(required=False)),
    ])
    body = StreamField([
        ('playbook', blocks.CharBlock(form_classname="playbook")),
        ('donations', blocks.RichTextBlock(required=False)),
        ('guests', blocks.RichTextBlock(required=False)),
        ('images', ImageChooserBlock(required=False)),
    ])

    content_panels = Page.content_panels + [
        FieldPanel('dinner_coordinator'),
        FieldPanel('date'),
		FieldPanel('food'),
        FieldPanel('body'),
    ]