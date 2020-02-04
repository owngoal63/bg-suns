from django.db import models

from wagtail.core.models import Page, Orderable
from wagtail.documents.edit_handlers import DocumentChooserPanel
from wagtail.search import index
from modelcluster.fields import ParentalKey
from wagtail.core.fields import RichTextField, StreamField
from wagtail.admin.edit_handlers import InlinePanel, FieldPanel, StreamFieldPanel

from . import blocks

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

    document_page_title = models.CharField(max_length=250, blank=False, null=True, help_text="Call this 'Documents and Forms' for the document Page for logic to work")
    document_page_description = RichTextField(features=["bold", "italic"], blank=False, null=True)

    video_link_section_title = models.CharField(max_length=400, blank=True, null=True, help_text='Add a title for the video link section')

    video_link_content = StreamField(
		[
			("video_links_url", blocks.VideoLinksBlock()),
		],
		null=True,
		blank=True,
	)

    content_panels = Page.content_panels + [
        # ...
        FieldPanel("document_page_title"),
        FieldPanel("document_page_description"),
        InlinePanel("related_documents", max_num=50, min_num=1, label="Document"),
        FieldPanel("video_link_section_title"),
        StreamFieldPanel("video_link_content"),
    ]    


   

   
