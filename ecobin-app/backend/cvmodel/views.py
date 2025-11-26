# api/views.py

import os
import json
from io import BytesIO
from PIL import Image
from rest_framework.decorators import api_view
from rest_framework.response import Response
from google import genai
from dotenv import load_dotenv # Pour charger la clé API

# --- CONFIGURATION DE L'API GEMINI ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

try:
    # Initialisation du client Gemini (doit se faire avec la clé API)
    GEMINI_CLIENT = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Erreur d'initialisation de l'API Gemini: Vérifiez votre clé API dans le fichier .env. {e}")
    GEMINI_CLIENT = None


@api_view(['POST'])
def predict_image(request):

    if GEMINI_CLIENT is None:
        return Response({
            "error": "Le service IA n'est pas configuré. Clé API manquante ou invalide."
        }, status=503)

    # 2. Récupération du fichier image (clé 'file' comme dans votre code React Native)
    if 'file' not in request.FILES:
        return Response({
            "error": "Le champ 'file' est manquant dans la requête POST."
        }, status=400)
    
    image_file = request.FILES['file']
    
    # 3. Conversion du fichier en objet Image PIL
    try:
        img_data = image_file.read()
        image_pil = Image.open(BytesIO(img_data)).convert('RGB')
    except Exception as e:
        return Response({
            "error": f"Erreur de lecture de l'image. Détail: {e}"
        }, status=400)
        
    # 4. Définition du prompt et du schéma de réponse
    
    # Le prompt demande à Gemini non seulement d'identifier, mais de classer
    # et de donner des instructions de tri précises.
    prompt_text = (
        "Vous êtes un expert en tri des déchets. Identifiez l'objet dans cette image. "
        "Fournissez sa classification précise et la consigne de tri pour le Bénin. "
        "Répondez uniquement en format JSON strict."
    )
    
    # Le schéma de réponse force Gemini à structurer sa réponse comme vous le souhaitez.
    response_schema = {
        'type': 'object',
        'properties': {
            'objet_identifie': {'type': 'string', 'description': "Nom précis de l'objet (ex: Bouteille d'eau en plastique)."},
            'classification_primaire': {'type': 'string', 'description': "Classification du matériau (ex: Plastique, Verre, Papier/Carton, Organique)."},
            'consigne_tri': {'type': 'string', 'description': "Consigne claire de tri (ex: Bac jaune, Bac vert, Déchetterie, Poubelle noire)."},
            'confidence': {'type': 'number', 'description': "Estimation de la confiance dans la classification sur une échelle de 0.0 à 1.0."}
        },
        'required': ['objet_identifie', 'classification_primaire', 'consigne_tri', 'confidence']
    }
    
    # 5. Appel de l'API Gemini
    try:
        response = GEMINI_CLIENT.models.generate_content(
            model='gemini-2.5-flash', # Modèle multimodal rapide et efficace
            contents=[
                image_pil,
                prompt_text
            ],
            config={
                'response_mime_type': 'application/json',
                'response_schema': response_schema,
                'temperature': 0.0 # Température basse pour une réponse factuelle
            }
        )
        
        # Le contenu est retourné sous forme de chaîne JSON par l'API
        response_json_str = response.candidates[0].content.parts[0].text
        data = json.loads(response_json_str)

        # 6. Retour de la réponse à l'application React Native
        # Nous retournons les champs que votre appli mobile attend, plus les nouveaux.
        return Response({
            "label": data.get('classification_primaire', 'Inconnu'),
            "confidence": data.get('confidence', 0.9), # Utilisation de la confiance retournée par Gemini
            "details": data # Retourner tous les détails pour une utilisation future
        }, status=200)

    except Exception as e:
        # Gérer les erreurs de l'API (quota, clé invalide, etc.)
        print(f"Erreur lors de l'appel à Gemini: {e}")
        return Response({
            "error": "Impossible de contacter le service d'identification IA. Veuillez réessayer.",
            "details": str(e)
        }, status=500)