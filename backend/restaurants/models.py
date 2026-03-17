from django.db import models

class Restaurant(models.Model):
    name     = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    image    = models.URLField(blank=True)

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='menu_items'
    )
    name  = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.name} - ₹{self.price}"