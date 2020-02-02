from django.db import models
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import (
    FieldPanel,
    FieldRowPanel,
    InlinePanel,
    MultiFieldPanel
)
from wagtail.core.fields import RichTextField
from wagtail.contrib.forms.models import (
    AbstractEmailForm,
    AbstractFormField
)

#from wagtail.admin.mail import send_mail


class FormField(AbstractFormField):
    page = ParentalKey(
        'ContactPage',
        on_delete=models.CASCADE,
        related_name='form_fields',
    )


class ContactPage(AbstractEmailForm):

    template = "contact/contact_page.html"
    max_count = 1
    subpage_types=[]
    # This is the default path.
    # If ignored, Wagtail adds _landing.html to your template name
    landing_page_template = "contact/contact_page_landing.html"

    intro = RichTextField(blank=True)
    thank_you_text = RichTextField(blank=True)

    content_panels = AbstractEmailForm.content_panels + [
        FieldPanel('intro'),
        InlinePanel('form_fields', label='Form Fields'),
        FieldPanel('thank_you_text'),
        MultiFieldPanel([
            FieldRowPanel([
                FieldPanel('from_address', classname="col6"),
                FieldPanel('to_address', classname="col6"),
            ]),
            FieldPanel("subject"),
        ], heading="Email Settings"),
    ]

    #send_mail('Subject here', 'Here is the message from wagtail.',  ['gordonlindsay@virginmedia.com'], 'from@example.com')

    def send_mail(self, form):

        for field in form:
            if field.label == "Name":
                xname = field.value()

            elif field.label == "Email":
                xemail = field.value()

            #if field.label == "Message":
            else:
                #xmessage = field.value()
                xmessage = "From: " + xname + "<br>"
                xmessage = xmessage + "Email Address: " + xemail + "<br><br>"
                xmessage = xmessage + "Message reads: " + field.value()
            #print("***" + field.label + "***")
            #print(field.value())


        message = Mail(
            from_email='from_email@example.com',
            to_emails='gordonlindsay@virginmedia.com',
            subject='Message from BG Suns Website',
            #html_content='<strong>and easy to do anywhere, even with Python</strong>')
            html_content=xmessage)
        try:
            sg = SendGridAPIClient('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')
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(e.message)