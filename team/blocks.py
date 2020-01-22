"""Streamfields are held in here """

from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

        
class CardBlock(blocks.StructBlock):
    """ Cards with image, name and button """

    #title = blocks.CharBlock(required=True, help_text='Add your title')

    cards = blocks.ListBlock(
        blocks.StructBlock(
            [
                ("name", blocks.TextBlock(required=True, max_length=200)),
                ("nickname", blocks.CharBlock(required=False, max_length=200)),
                ("position", blocks.CharBlock(required=True, max_length=40)),
                ("age", blocks.CharBlock(required=False, max_length=2)),
                ("height", blocks.CharBlock(required=False, max_length=10)),
                ("occupation", blocks.CharBlock(required=False, max_length=200)),
                ("playing_style", blocks.CharBlock(required=False, max_length=200)),
                ("image", ImageChooserBlock(required=True)),
                ("button_page", blocks.PageChooserBlock(required=False))
            ]
        )
    )

    class Meta:
        template = "team/card_block.html"
        icon = "placeholder"
        label = "Player Cards"