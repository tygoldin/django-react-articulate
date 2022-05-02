# Generated by Django 4.0.2 on 2022-05-02 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articulate', '0007_userrecommendations'),
    ]

    operations = [
        migrations.CreateModel(
            name='Top100ArtistsByViews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artist', models.TextField(blank=True, null=True)),
                ('views', models.DecimalField(blank=True, decimal_places=0, max_digits=32, null=True)),
            ],
            options={
                'db_table': '05_top100_artists_by_views',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Top100ArtworksByRatings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artwork_id', models.BigIntegerField()),
                ('avg_rating', models.DecimalField(blank=True, decimal_places=4, max_digits=14, null=True)),
            ],
            options={
                'db_table': '02_top100_artworks_by_ratings',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Top100ArtworksByViews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artwork_id', models.BigIntegerField()),
                ('views', models.DecimalField(blank=True, decimal_places=0, max_digits=32, null=True)),
            ],
            options={
                'db_table': '01_top100_artworks_by_views',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Top100LocationsByRatings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.TextField(blank=True, null=True)),
                ('avg_rating', models.DecimalField(blank=True, decimal_places=4, max_digits=14, null=True)),
            ],
            options={
                'db_table': '09_top100_locations_by_ratings',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Top100LocationsByViews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.TextField(blank=True, null=True)),
                ('views', models.DecimalField(blank=True, decimal_places=0, max_digits=32, null=True)),
            ],
            options={
                'db_table': '10_top100_locations_by_views',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TopCategoriesByRatingsForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form', models.TextField(blank=True, null=True)),
                ('avg_rating', models.DecimalField(blank=True, decimal_places=4, max_digits=14, null=True)),
            ],
            options={
                'db_table': '07_top_categories_by_ratings_form',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TopCategoriesByRatingsType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.TextField(blank=True, null=True)),
                ('avg_rating', models.DecimalField(blank=True, decimal_places=4, max_digits=14, null=True)),
            ],
            options={
                'db_table': '08_top_categories_by_ratings_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TopCategoriesForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form', models.TextField(blank=True, null=True)),
                ('popularity', models.DecimalField(blank=True, decimal_places=4, max_digits=36, null=True)),
            ],
            options={
                'db_table': '03_top_categories_form',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TopCategoriesType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.TextField(blank=True, null=True)),
                ('popularity', models.DecimalField(blank=True, decimal_places=4, max_digits=36, null=True)),
            ],
            options={
                'db_table': '04_top_categories_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TopTimeframesByViews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timeframe', models.TextField(blank=True, null=True)),
                ('popularity', models.DecimalField(blank=True, decimal_places=4, max_digits=36, null=True)),
            ],
            options={
                'db_table': '06_top_timeframes_by_views',
                'managed': False,
            },
        ),
    ]
