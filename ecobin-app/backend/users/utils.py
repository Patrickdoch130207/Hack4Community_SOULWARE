from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes



import random, datetime
from django.utils import timezone

def generate_verification_code():
    return str(random.randint(100000, 999999))

def save_code(user):
    code = generate_verification_code()
    user.verification_code = code
    user.code_expiry = timezone.now() + datetime.timedelta(minutes=5)
    user.save()
    return code

