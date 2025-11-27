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
    # Note : Le client ne nécessite pas de vérification de la clé ici si elle est dans .env et load_dotenv a été appelé.
    GEMINI_CLIENT = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Erreur d'initialisation de l'API Gemini: Vérifiez votre clé API dans le fichier .env. {e}")
    GEMINI_CLIENT = None

# 4. Définition du prompt et du schéma de réponse (Déplacé en dehors de la fonction pour la clarté)

# Le prompt demande à Gemini non seulement d'identifier, mais de classer
# et de donner des instructions de tri précises.
# ATTENTION : Ce prompt doit être passé comme 'prompt_text' dans l'appel
prompt_text = """
Directive Principale :
Vous êtes un modèle de classification d'images dédié au tri des déchets. 
Analysez l'image fournie et classez le déchet dans l'une des catégories de sortie autorisées.

Classes de Sortie Autorisées :
1. Plastique (doit spécifier le type : PET, HDPE, PVC, LDPE, PP, PS, etc.)
2. Textile
3. Verre
4. Déchet Organique
5. Papier et Dérivés
6. Carton
7. Métal
8. Déchet Électronique (D3E)
9. Non-Classé

Règles de Tri Spécifiques (pour la construction du message 'action_a_faire') :
La phrase doit TOUJOURS commencer par : "Rendez-vous sur notre point de collecte le plus proche et..."
Ensuite, complétez selon la matière :
- Poubelle Jaune (Plastique/Carton/Métal) : "...déposez cet emballage dans le bac Jaune."
- Poubelle Verte (Verre) : "...jetez ce verre dans le bac Vert (sans bouchon ni couvercle)."
- Poubelle Bleue (Papiers) : "...insérez ce papier dans le bac Bleu."
- Poubelle Marron (Biodéchets) : "...videz ce déchet organique dans le bac Marron."
- Poubelle Grise/Noire (Non-recyclable) : "...jetez ce déchet dans le bac Gris/Noir."
- Containers Spécifiques (Textile/D3E) : "...déposez cet objet dans la borne dédiée."

Format de la Réponse :
Retournez uniquement un objet JSON STRICTEMENT CONFORME à la structure spécifiée.

Champs JSON Requis :
1. "classe_detectee" (String) : La classe principale (e.g., "Plastique", "Textile").
2. "type_de_dechet" (String) : Description courte (e.g., "Bouteille PET", "Journal"). Pour Non-Classé : "Objet non-classé".
3. "recyclable" (Booléen) : Vrai ou Faux.
4. "action_a_faire" (String) : Instruction composée : Déplacement + Choix du bac.
    - Exemples d'instructions attendues :
        - Pour Plastique : "Rendez-vous sur notre point de collecte le plus proche et déposez cet emballage dans le bac Jaune."
        - Pour Verre : "Rendez-vous sur notre point de collecte le plus proche et jetez ce verre dans le bac Vert (sans bouchon ni couvercle)."
        - Pour Non-Classé : "Rendez-vous sur notre point de collecte le plus proche et jetez ce déchet dans le bac Gris/Noir."
5. "confiance_modele" (Float) : Le score de confiance (0.0 à 1.0).

Exemple de Sortie JSON (Attendu) :
{
  "classe_detectee": "Plastique",
  "type_de_dechet": "PET",
  "recyclable": true,
  "action_a_faire": "Rendez-vous sur notre point de collecte le plus proche et déposez cet emballage dans le bac Jaune.",
  "confiance_modele": 0.98
}
"""

# Le schéma de réponse DOIT UTILISER les clés exactes demandées dans le prompt:
# "classe_detectee", "type_de_dechet", "recyclable", "action_a_faire", "confiance_modele"
response_schema = {
    'type': 'object',
    'properties': {
        'classe_detectee': {'type': 'string', 'description': "La classe de déchet principale (ex: Plastique, Verre, Non-Classé)."},
        'type_de_dechet': {'type': 'string', 'description': "Type spécifique du déchet (ex: PET, Papier journal, Objet non-classé)."},
        'recyclable': {'type': 'boolean', 'description': "Indique si le déchet est recyclable (true/false)."},
        'action_a_faire': {'type': 'string', 'description': "L'instruction de tri précise (ex: Déposer dans la poubelle Jaune)."},
        'confiance_modele': {'type': 'number', 'description': "Score de confiance de la classification (0.0 à 1.0)."}
    },
    # Utilisation des clés du prompt
    'required': ['classe_detectee', 'type_de_dechet', 'recyclable', 'action_a_faire', 'confiance_modele']
}


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
        
    # 5. Appel de l'API Gemini
    try:
        response = GEMINI_CLIENT.models.generate_content(
            model='gemini-2.5-flash', # Modèle multimodal rapide et efficace
            contents=[
                image_pil,
                prompt_text # Utilisation du prompt défini globalement
            ],
            config={
                'response_mime_type': 'application/json',
                'response_schema': response_schema,
                'temperature': 0.0 # Température basse pour une réponse factuelle
            }
        )
        
        # Le contenu est retourné sous forme de chaîne JSON par l'API
        response_json_str = response.text.strip() # .text est l'attribut standard pour le contenu textuel
        data = json.loads(response_json_str)

        # 6. Retour de la réponse à l'application React Native
        # Nous retournons les champs du JSON complet, car ils sont tous pertinents
        return Response({
            "classe_detectee": data.get('classe_detectee', 'Inconnu'),
            "type_de_dechet": data.get('type_de_dechet', 'Non spécifié'),
            "recyclable": data.get('recyclable', False),
            "action_a_faire": data.get('action_a_faire', 'Contacter un service de tri.'),
            "confiance_modele": data.get('confiance_modele', 0.5)
        }, status=200)

    except Exception as e:
        # Gérer les erreurs de l'API (quota, clé invalide, etc.)
        print(f"Erreur lors de l'appel à Gemini: {e}")
        return Response({
            "error": "Impossible de contacter le service d'identification IA. Veuillez réessayer.",
            "details": str(e)
        }, status=500)