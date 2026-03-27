from django.db import models

class Products(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    short_description = models.CharField(max_length=100)
    description = models.TextField()
    def __str__(self):
        return self.name

# todo