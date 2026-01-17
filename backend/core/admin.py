from django.contrib import admin
from django.apps import apps

# This automatically registers ALL models from your models.py
app = apps.get_app_config('core')

for model_name, model in app.models.items():
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass