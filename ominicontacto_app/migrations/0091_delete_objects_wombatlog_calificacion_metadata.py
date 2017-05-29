# -*- coding: utf-8 -*-
# Generated Federico Peker
from __future__ import unicode_literals

from django.db import migrations
from ominicontacto_app.models import WombatLog, MetadataCliente, CalificacionCliente


def create_delete_objects_models(apps, schema_editor):
    WombatLog.objects.all().delete()
    MetadataCliente.objects.all().delete()
    CalificacionCliente.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0090_auto_20170524_1235'),
    ]

    operations = [
        migrations.RunPython(create_delete_objects_models),
    ]