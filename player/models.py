"""Blog listing and blog detail pages."""
from django.db import models
from django.shortcuts import render

from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.core.fields import StreamField
from wagtail.core.models import Page
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, route

from streams import blocks


class PlayerListingPage(RoutablePageMixin, Page):
	"""Listing page lists all the Player Detail Pages."""

	template = "player/player_listing_page.html"
	subpage_types = ['player.PlayerDetailPage']
	max_count = 1

	custom_title = models.CharField(
		max_length=100,
		blank=False,
		null=False,
		help_text='Overwrites the default title',
	)

	content_panels = Page.content_panels + [
		FieldPanel("custom_title"),
	]

	def get_context(self, request, *args, **kwargs):
		"""Getting the context for the page from the PlayerDetailPage"""
		context = super().get_context(request, *args, **kwargs)
		context["player_list"] = PlayerDetailPage.objects.live().public()
		return context

	@route(r'^scorerstats/$')
	def scorerstats(self, request, *args, **kwargs):
		context = self.get_context(request, *args, **kwargs)
		return render(request, "player/scorerstats.html", context)	

	@route(r'^leaguestats/$')
	def leaguestats(self, request, *args, **kwargs):
		context = self.get_context(request, *args, **kwargs)
		return render(request, "player/leaguestats.html", context)	


class PlayerDetailPage(Page):
	"""Player detail page."""

	subpage_types=[]

	name = models.CharField(
		max_length=200,
		blank=False,
		null=False,
		help_text='Player Full Name',
	)
	player_image = models.ForeignKey(
		"wagtailimages.Image",
		blank=False,
		null=True,
		related_name="+",
		on_delete=models.SET_NULL,
		help_text='Player Image',
	)

	nickname = models.CharField(
		max_length=200,
		blank=False,
		null=False,
		help_text='Player Nickname',
	)

	position = models.CharField(
		max_length=40,
		blank=False,
		null=False,
		help_text='Player Position',
	)

	age = models.CharField(
		max_length=2,
		blank=True,
		null=True,
		help_text='Player Age',
	)

	height = models.CharField(
		max_length=10,
		blank=True,
		null=True,
		help_text='Player Height',
	)

	occupation = models.CharField(
		max_length=200,
		blank=True,
		null=True,
		help_text='Player Occupation',
	)

	playing_style = models.CharField(
		max_length=200,
		blank=True,
		null=True,
		help_text='Player playing style',
	)

	

	# content = StreamField(
	#     [
	#         ("title_and_text", blocks.TitleAndTextBlock()),
	#         ("full_richtext", blocks.RichtextBlock()),
	#         ("simple_richtext", blocks.SimpleRichtextBlock()),
	#         ("cards", blocks.CardBlock()),
	#         ("cta", blocks.CTABlock()),
	#     ],
	#     null=True,
	#     blank=True,
	# )

	content_panels = Page.content_panels + [
		FieldPanel("name"),
		ImageChooserPanel("player_image"),
		FieldPanel("nickname"),
		FieldPanel("position"),
		FieldPanel("age"),
		FieldPanel("height"),
		FieldPanel("occupation"),
		FieldPanel("playing_style"),
		#StreamFieldPanel("content"),
	]
