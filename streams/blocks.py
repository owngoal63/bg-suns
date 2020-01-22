"""Streamfields are held in here """

from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

class TitleAndTextBlock(blocks.StructBlock):
    """ Title and text """

    title = blocks.CharBlock(required=True, help_text='Add your title')
    text = blocks.CharBlock(required=True, help_text='Add additional text')

    class Meta:
        template = "streams/title_and_text_block.html"
        icon = "edit"
        label = "Title & Text"




