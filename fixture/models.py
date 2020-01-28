"""Fixture listing and fixture detail pages."""
from django.db import models
from django.shortcuts import render

from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel, FieldRowPanel
from wagtail.core.fields import RichTextField
from wagtail.core.fields import StreamField
from wagtail.core.models import Page
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from wagtail.core import blocks

#from streams import blocks


class FixtureListingPage(RoutablePageMixin, Page):
	"""Listing page lists all the Fixture Detail Pages."""

	template = "fixture/fixture_listing_page.html"

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
		"""Getting the context for the page from the FixtureDetailPage"""
		context = super().get_context(request, *args, **kwargs)
		context["fixture_list"] = FixtureDetailPage.objects.live().public()
		return context

	@route(r'^leaguestats/$')
	def leaguestats(self, request, *args, **kwargs):
		context = self.get_context(request, *args, **kwargs)
		return render(request, "player/leaguestats.html", context)	


class FixtureDetailPage(Page):
	"""Fixture detail page."""

	competition = models.CharField(
		max_length=100,
		blank=False,
		null=True,
		help_text='Name of Competition e.g. Div 2, Cup QF etc.',
	)

	hometeam = models.CharField(
		max_length=200,
		blank=False,
		null=False,
		help_text='Home team name',
	)
	hometeam_image = models.ForeignKey(
		"wagtailimages.Image",
		blank=False,
		null=True,
		related_name="+",
		on_delete=models.SET_NULL,
		help_text='Home team Logo',
	)

	awayteam = models.CharField(
		max_length=200,
		blank=False,
		null=False,
		help_text='AWay Team Name',
	)
	awayteam_image = models.ForeignKey(
		"wagtailimages.Image",
		blank=False,
		null=True,
		related_name="+",
		on_delete=models.SET_NULL,
		help_text='Away Team Logo',
	)

	fixture_date_time = models.CharField(
		max_length=40,
		blank=False,
		null=False,
		help_text='Date and Time of Fixture',
	)

	fixture_location = models.CharField(
		max_length=100,
		blank=False,
		null=False,
		help_text='Fixture location',
	)

	fixture_status = models.CharField(
		max_length=100,
		blank=False,
		null=False,
		help_text='Fixture status- set to either Upcoming Match or Result',
	)

	HT_FT_PTS = models.IntegerField(null=True, blank=True)
	AT_FT_PTS = models.IntegerField(null=True, blank=True)
	HT_HT_PTS = models.IntegerField(null=True, blank=True)
	AT_HT_PTS = models.IntegerField(null=True, blank=True)

	Home_Team_Scorers = RichTextField(features=["bold", "italic"],null=True, blank=True)
	Away_Team_Scorers = RichTextField(features=["bold", "italic"], null=True, blank=True)

	Match_Officials = RichTextField(features=["bold", "italic"],null=True, blank=True)
	Match_Report = RichTextField(features=["bold", "italic"],null=True, blank=True)

	content_panels = Page.content_panels + [
		FieldPanel("competition"),
		FieldPanel("hometeam"),
		ImageChooserPanel("hometeam_image"),
		FieldPanel("awayteam"),
		ImageChooserPanel("awayteam_image"),
		FieldPanel("fixture_date_time"),
		FieldPanel("fixture_location"),
		FieldPanel("fixture_status"),
		FieldRowPanel(
			[
				FieldPanel("HT_FT_PTS"),
				FieldPanel("HT_HT_PTS"),
				FieldPanel("AT_FT_PTS"),
				FieldPanel("AT_HT_PTS"),
			]
		),
		FieldPanel("Home_Team_Scorers"),
		FieldPanel("Away_Team_Scorers"),
		FieldPanel("Match_Officials"),
		FieldPanel("Match_Report")
	]

