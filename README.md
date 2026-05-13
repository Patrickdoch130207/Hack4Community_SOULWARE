# Hack4Community — SOULWARE
 
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=for-the-badge&logo=darkreader&logoColor=black)
 
> Official repository for Team **SOULWARE**'s submission to the **Hack4Community** hackathon.
 
---
 
## About
 
EcoBin is a mobile application for household waste management built with an AI-first approach.
 
The user takes a photo of any object and an AI model identifies what type of waste it is. Based on that result, the app provides handling instructions and guides the user to the nearest suitable collection point, chosen from an interactive map that lists all available collection points.
 
EcoBin also includes an intelligent chatbot that answers any question related to the environment, recycling, waste sorting, and eco-friendly practices.
 
---
 
## Hackathon Theme
 
AI in the service of creative and cultural industries.
 
**Challenge: The Smart Recycling Guide**
 
How can artificial intelligence help individuals better understand, sort, and dispose of their waste by turning recycling into an accessible, educational, and interactive experience?
 
---
 
## Skills & Technologies
 
| Skill | Description |
|---|---|
| Teamwork | Agile collaboration across frontend, backend and AI |
| RAG Systems | Retrieval-Augmented Generation powering the environmental chatbot |
| CNN + YOLO | Real-time waste detection and classification from photos |
| Gemini API | AI-powered responses and image understanding |

## Tech Stack
 
| Layer | Technology |
|---|---|
| Mobile | ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) Expo + Expo Router |
| Language | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript |
| Backend | ![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white) Python / Django |
| AI Detection | ![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=flat&logo=darkreader&logoColor=black) CNN with YOLO |
| AI Chatbot | ![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat&logo=google&logoColor=white) Gemini API + RAG |
---

## Project Structure

```
Hack4Community_SOULWARE/
├── ecobin-app/
│   ├── app/               # Screens and navigation (Expo Router)
│   ├── assets/images/     # Static assets
│   ├── backend/           # Python backend
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.js
└── README.md
```

---

## Prerequisites
 
- ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)
- npm or yarn
- ![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
- **Expo Go** app on your phone — [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Patrickdoch130207/Hack4Community_SOULWARE.git
cd Hack4Community_SOULWARE/ecobin-app
```

Install dependencies:

```bash
npm install
```

---

## Running the app with Expo Go

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.
Make sure your phone and computer are on the same Wi-Fi network.

---

## Running the backend

 
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## Team

- Dieugrand Patrick DOCHAMOU(Me) - AI Engeneer
- Bénito ATIGOSSOU - Developper Full Stack
- AGNIDE Nawarath - Team Lead Content Creator, Designer
- HOUETO Laurel - UI/UX Designer 

---

## License

Built for Hack4Community. All rights reserved to Team SOULWARE.
