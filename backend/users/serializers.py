from rest_framework import serializers
from django.contrib.auth import get_user_model

# Get our custom User model
User = get_user_model()

# ================================
# REGISTER SERIALIZER
# Validates signup data
# ================================
class RegisterSerializer(serializers.ModelSerializer):

    # Extra field — not in model but needed for signup
    password = serializers.CharField(
        write_only=True,    # never send password back to frontend
        min_length=6        # minimum 6 characters
    )

    class Meta:
        model  = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Create user with hashed password
        user = User.objects.create_user(
            username = validated_data['username'],
            email    = validated_data['email'],
            password = validated_data['password']  # automatically hashed!
        )
        return user


# ================================
# USER SERIALIZER
# Returns user data (no password)
# ================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email']
        # Notice: NO password field here — never expose it