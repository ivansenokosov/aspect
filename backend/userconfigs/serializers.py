from rest_framework import serializers
from userconfigs.models import *

class UserInvConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInvConfigs
        fields = '__all__'

class CountUnreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInvConfigs
        fields = ['id', ]
