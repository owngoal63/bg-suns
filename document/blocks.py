"""Streamfields are held in here """

from wagtail.core import blocks
from wagtail.core.blocks import URLBlock

        
class VideoLinksBlock(blocks.StructBlock):
    """ External Links to video Block """


    video_links = blocks.ListBlock(
        blocks.StructBlock(
            [
                ("video_link_name", blocks.CharBlock(required=False, max_length=400, help_text='Provide Name for video link')),
                ("video_link_url", blocks.URLBlock(required=False, help_text='Provide URL to video')),         
            ]
        )
    )

    class Meta:
        template = "document/video_links_block.html"
        icon = "placeholder"
        label = "Video Links"