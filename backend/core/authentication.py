from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User


class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom Authentication to handle 'user_id' instead of default 'id'
    """

    def get_user(self, validated_token):
        try:
            # 1. Get the user_id from the token
            user_id = validated_token['user_id']

            # 2. Find the user in YOUR custom table
            user = User.objects.get(user_id=user_id)
            return user

        except User.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')
        except KeyError:
            raise AuthenticationFailed('Token is invalid', code='token_invalid')