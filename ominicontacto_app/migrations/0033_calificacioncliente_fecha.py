# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-11-25 19:31
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0033_duraciondellamada'),
    ]

    operations = [
        migrations.AddField(
            model_name='calificacioncliente',
            name='fecha',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 11, 25, 19, 31, 24, 46530, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
