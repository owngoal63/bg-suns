from django.db import models

from wagtail.core.models import Page, Orderable
from wagtail.documents.edit_handlers import DocumentChooserPanel
from wagtail.search import index
from modelcluster.fields import ParentalKey
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import InlinePanel, FieldPanel

class DocumentList(Orderable):

    page = ParentalKey("document.DocumentPage", related_name="related_documents")
    related_document = models.ForeignKey(
        "wagtaildocs.Document",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    panels = [DocumentChooserPanel("related_document")]

class DocumentPage(Page):
    
    templates = "document/document_page.html"
    subpage_types=[]

    ''' Allow for 2 pages maximum - One for regular text documents and one for Videos '''
    max_count = 2

    document_page_title = models.CharField(max_length=250, blank=False, null=True)
    document_page_description = RichTextField(features=["bold", "italic"], blank=False, null=True)

    # related_document = models.ForeignKey(
    #     'wagtaildocs.Document', blank=True, null=True,
    #      on_delete=models.SET_NULL, related_name='+'
    # )

    content_panels = Page.content_panels + [
        # ...
        FieldPanel("document_page_title"),
        FieldPanel("document_page_description"),
        InlinePanel("related_documents", max_num=50, min_num=1, label="Document"),
    ]    


# class DocumentPage(Page):

#     description = models.CharField(max_length=250)
#     body = RichTextField(blank=True)

#     search_fields = Page.search_fields + [
#         index.SearchField('description'),
#     ]

#     content_panels = Page.content_panels + [
#         FieldPanel('description'),
#         InlinePanel('gallery_documents', label="Gallery documents"),
#     ]


# class BlogPageGalleryImage(Orderable):
#     page = ParentalKey(BlogPage, on_delete=models.CASCADE, related_name='gallery_images')
#     image = models.ForeignKey(
#         'wagtailimages.Image', on_delete=models.CASCADE, related_name='+'
#     )
#     caption = models.CharField(blank=True, max_length=250)

#     panels = [
#         ImageChooserPanel('image'),
#         FieldPanel('caption'),
#     ]    
