from django.db import models

from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.core.models import Page
from wagtail.core.fields import StreamField

from . import blocks

class TeamPage(Page):
	"""Page class to display cards for team."""

	template = "team/team_page.html"

	content = StreamField(
		[
			("cards", blocks.CardBlock()),
		],
		null=True,
		blank=True,
	)

	subtitle = models.CharField(max_length=100, null=True, blank=True)

	content_panels = Page.content_panels + [
		FieldPanel("subtitle"),
		StreamFieldPanel("content"),
	]

	class Meta:  # noqa 
		verbose_name = "Team Cards Page"
		verbose_name_plural = "Team Cards Pages"

class TeamPlayerPage(Page):
	"""Page class to display player details"""

	template = "team/team_player_page.html"

	def get_context(self, request, *args, **kwargs):
		"""Adding custom stuff to our context."""
		context = super().get_context(request, *args, **kwargs)
		context["player_details"] = TeamPage.objects.live().public()
		return context
