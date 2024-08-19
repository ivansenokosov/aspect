from rest_framework import serializers
from discounts.models import *

class InvDisountGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvDisountGroup
        fields = '__all__'

class InvSerieDisountSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvSerieDisount
        fields = '__all__'

class InvOptionDisountSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvOptionDisount
        fields = '__all__'

class UserInvDisountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInvDisount
        fields = '__all__'