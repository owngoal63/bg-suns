"""Streamfields are held in here """

from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

        
class NewsBlock(blocks.StructBlock):
    """ News Block """

    #title = blocks.CharBlock(required=True, help_text='Add your title')

    news_items = blocks.ListBlock(
        blocks.StructBlock(
            [
                ("headline", blocks.CharBlock(required=True, max_length=100)),
                ("story", blocks.RichTextBlock(required=False, max_length=400)),
                
            ]
        )
    )

    class Meta:
        template = "home/news_block.html"
        icon = "placeholder"
        label = "News Items"