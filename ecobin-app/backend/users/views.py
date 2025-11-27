from datetime import timedelta
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate,get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import openai
from openai import OpenAI
import json
from django.http import JsonResponse
from django.core.mail import send_mail
from .utils import generate_verification_code, save_code
from django.template.loader import render_to_string
from django.utils import timezone
import string
import random


prompt_system = (
    "Rôle et Objectif : "
    "Vous êtes un agent IA conversationnel éducatif et expert, spécialisé dans le recyclage, l'économie verte, la protection de l'environnement et la réduction de l'effet de serre. "
    "Votre objectif principal est d'informer, de sensibiliser et d'éclairer les utilisateurs sur ces sujets cruciaux, en répondant à leurs questions de manière précise, compréhensible et actionable. "
    
    "Persona : "
    "Expertise : Vous possédez une connaissance approfondie et à jour sur les meilleures pratiques, les concepts scientifiques, les politiques environnementales, les technologies vertes et les impacts écologiques. "
    "Pédagogie : Vous êtes capable d'expliquer des concepts complexes de manière simple, claire et accessible, quel que soit le niveau de connaissance initial de l'utilisateur. "
    "Engagement : Votre ton est positif, encourageant et motivant. Vous inspirez à l'action et à la réflexion sans être alarmiste ou moralisateur. "
    "Neutre et Factuel : Vous basez toujours vos réponses sur des faits scientifiques avérés et des informations vérifiables, évitant les opinions personnelles ou les controverses non étayées. "
    "Pratique : Vous fournissez des conseils concrets et des exemples pratiques que les utilisateurs peuvent appliquer dans leur vie quotidienne. "
    
    "Domaines d'Expertise Spécifiques : "
    "Recyclage et Gestion des Déchets : Types de matériaux recyclables (plastique, verre, papier, métal, électronique, textile, organique), Processus de recyclage, Tri sélectif (consignes locales si l'utilisateur spécifie une région, sinon générales), Le \"upcycling\" et le \"downcycling\", Réduction des déchets (les 3R : Réduire, Réutiliser, Recycler), Gestion des déchets dangereux ou spécifiques. "
    "Économie Verte et Circulaire : Définition et principes de l'économie verte et circulaire, Modèles d'affaires durables, éco-conception, Consommation responsable, circuits courts, Labels et certifications écologiques, Investissements verts, finance durable. "
    "Protection de l'Environnement et Biodiversité : Écosystèmes, biodiversité et services écosystémiques, Pollution (air, eau, sol, sonore, lumineuse) et ses impacts, Déforestation, désertification, Protection des espèces menacées, Conservation des ressources naturelles (eau, énergie), Actions individuelles et collectives pour la protection. "
    "Changement Climatique et Réduction de l'Effet de Serre : Mécanismes de l'effet de serre et gaz à effet de serre (GES), Causes et conséquences du changement climatique, Énergies renouvelables (solaire, éolien, hydraulique, géothermique), Efficacité énergétique, Mobilité durable, Séquestration du carbone, Accords et politiques climatiques (COP, Accords de Paris). "
    
    "Directives de Réponse : "
    "Compréhensibilité : Adaptez votre langage au niveau de l'utilisateur. Utilisez des analogies si nécessaire. "
    "Précision : Fournissez des informations factuelles et vérifiables. "
    "Exemples Concrets : Illustrez vos explications avec des exemples pratiques et des scénarios réels. "
    "Conseils Actionnables : Lorsque pertinent, proposez des actions concrètes que l'utilisateur peut entreprendre. "
    "Limites : Si une question est hors de votre domaine d'expertise, indiquez-le poliment. "
    "Interactivité : N'hésitez pas à poser des questions de clarification si la question de l'utilisateur est ambiguë pour fournir la meilleure réponse."
)


from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY
client = OpenAI(api_key=settings.OPENAI_API_KEY)

@csrf_exempt
@api_view(['POST'])
def register_user(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()  
        print("Utilisateur créé:", user)

        code=save_code(user)


        html_message = render_to_string("emails/verification_email.html", {
                "user": user,
                "code": code
                })

        send_mail(
            subject="Vérification de votre compte EcoBin",
            message=f"Votre code de vérification est : {code}",  # fallback texte
            from_email="noreply@ecobin.com",
            recipient_list=[user.email],
            html_message=html_message
              )

        return Response(
            {"message": "Utilisateur créé avec succès. Vérifiez votre email."},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user is not None:
     if not user.email_verified :
        return Response(
            {'error': 'Veuillez vérifier votre email avant de vous connecter.'},
            status=status.HTTP_403_FORBIDDEN
        )

     refresh = RefreshToken.for_user(user)
     return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'email_verified': user.email_verified,
        }
    })
    else:
       return Response(
        {'error': 'Email ou mot de passe incorrect'},
        status=status.HTTP_401_UNAUTHORIZED
    )
    

@api_view(['POST'])
def home(request):
    return Response({"message": "Bienvenue à la page d'accueil!"}, status=status.HTTP_200_OK)    



@csrf_exempt
@api_view(['POST'])
def chatbot(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message")

            completion = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": prompt_system},
                    {"role": "user", "content": user_message}
                ]
            )

            bot_reply = completion.choices[0].message.content

            return JsonResponse({"reply": bot_reply})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

@api_view(['POST'])
def verify_code(request):

    User = get_user_model()
    email = request.data.get("email")
    code = request.data.get("code")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Utilisateur introuvable"}, status=404)

    if user.verification_code != code:
        return Response({"error": "Code invalide"}, status=400)

    if user.code_expiry < timezone.now():
        return Response({"error": "Code expiré"}, status=400)

    user.email_verified = True
    user.save()

    return Response({"message": "Compte vérifié avec succès ✅"})

def generate_code(length=6):
    return ''.join(random.choices(string.digits, k=length))


@api_view(['POST'])
def password_reset_request(request):
    User = get_user_model()
    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # On ne révèle pas si l'email existe ou non
        return Response(
            {'message': 'Si cet email existe, un code a été envoyé.'},
            status=status.HTTP_200_OK
        )

    code = generate_code()
    user.verification_code = code
    user.code_expiry = timezone.now() + timedelta(minutes=15)
    user.save()

    send_mail(
        subject="Code de réinitialisation EcoBin",
        message=f"Votre code de réinitialisation est : {code}",
        from_email="noreply@ecobin.com",
        recipient_list=[email]
    )

    return Response(
        {'message': 'Si cet email existe, un code a été envoyé.'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
def password_reset_confirm(request):
    User = get_user_model()
    email = request.data.get("email")
    code = request.data.get("code")
    new_password = request.data.get("new_password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Code invalide'}, status=400)

    if user.verification_code != code:
        return Response({'error': 'Code invalide'}, status=400)

    if user.code_expiry < timezone.now():
        return Response({'error': 'Code expiré'}, status=400)

    user.set_password(new_password)
    user.verification_code = ""
    user.code_expiry = None
    user.save()

    return Response(
        {'message': 'Mot de passe réinitialisé avec succès '},
        status=status.HTTP_200_OK
    )




    


   
