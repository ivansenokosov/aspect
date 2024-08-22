from rest_framework import serializers
from directories.models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_staff=validated_data['is_staff'],
            is_active=validated_data['is_active'],
            is_superuser=validated_data['is_superuser'] 
        )

        user.set_password(validated_data['password'])
        user.save()

        return user 
    
    def update(self, instance, validated_data):
        instance.username=validated_data['username']
        instance.first_name=validated_data['first_name']
        instance.last_name=validated_data['last_name']
        instance.email=validated_data['email']
        instance.is_staff=validated_data['is_staff']
        instance.is_active=validated_data['is_active']
        instance.is_superuser=validated_data['is_superuser']
        
        instance.set_password(validated_data['password'])
        instance.save()
        return instance