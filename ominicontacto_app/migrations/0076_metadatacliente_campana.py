# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-05-12 15:56
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0075_wombatlog_campana'),
    ]

    operations = [
        migrations.AddField(
            model_name='metadatacliente',
            name='campana',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='metadatacliente', to='ominicontacto_app.CampanaDialer'),
            preserve_default=False,
        ),
    ]
