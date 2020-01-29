"""Flexible page."""
from django.db import models

from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.core.models import Page
from wagtail.core.fields import StreamField
from wagtail.images.edit_handlers import ImageChooserPanel

from streams import blocks

class FlexPage(Page):
	"""Flexibile page class."""
	subpage_types=[]

	template = "flex/flex_page.html"

	content = StreamField(
		[
			("title_and_text", blocks.TitleAndTextBlock()),
		],
		null=True,
		blank=True,
	)

	subtitle = models.CharField(max_length=100, null=True, blank=True)

	flex_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="+"
    )

	content_panels = Page.content_panels + [
		FieldPanel("subtitle"),
		ImageChooserPanel("flex_image"),
		StreamFieldPanel("content"),
	]

	class Meta:  # noqa 
		verbose_name = "Flex Page"
		verbose_name_plural = "Flex Pages"
		