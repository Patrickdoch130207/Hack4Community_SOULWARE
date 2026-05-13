# Hack4Community — SOULWARE

<div align="center">

[![React Native](https://skillicons.dev/icons?i=react)](https://reactnative.dev)
[![Expo](https://skillicons.dev/icons?i=expo)](https://expo.dev)
[![TypeScript](https://skillicons.dev/icons?i=ts)](https://www.typescriptlang.org)
[![Python](https://skillicons.dev/icons?i=python)](https://www.python.org)
[![Django](https://skillicons.dev/icons?i=django)](https://www.djangoproject.com)

<br/>

![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=for-the-badge&logo=darkreader&logoColor=black)
![RAG](https://img.shields.io/badge/RAG_System-FF6B6B?style=for-the-badge&logo=buffer&logoColor=white)

<br/>

> Official repository for Team **SOULWARE**'s submission to the **Hack4Community** hackathon.

</div>

---

## About

**EcoBin** is a mobile application for household waste management built with an AI-first approach.

The user takes a photo of any object and an AI model identifies what type of waste it is. Based on that result, the app provides handling instructions and guides the user to the nearest suitable collection point, chosen from an interactive map that lists all available collection points.

EcoBin also includes an intelligent chatbot that answers any question related to the environment, recycling, waste sorting, and eco-friendly practices.

---

## Hackathon Theme

**AI in the service of creative and cultural industries.**

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

---

## Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| Mobile | [![React Native](https://skillicons.dev/icons?i=react&theme=light)](https://reactnative.dev) Expo + Expo Router |
| Language | [![TypeScript](https://skillicons.dev/icons?i=ts&theme=light)](https://www.typescriptlang.org) TypeScript |
| Backend | [![Django](https://skillicons.dev/icons?i=django&theme=light)](https://www.djangoproject.com) Python / Django |
| AI Detection | ![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=flat&logo=darkreader&logoColor=black) CNN with YOLO |
| AI Chatbot | ![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat&logo=google&logoColor=white) Gemini API + RAG |

</div>

---

## Project Structure

```
Hack4Community_SOULWARE/
├── ecobin-app/
│   ├── app/               # Screens and navigation (Expo Router)
│   ├── assets/            # Static assets
│   ├── backend/           # Django backend
│   │   ├── backend/       # Django project settings
│   │   ├── collecte/      # Collection points app
│   │   ├── cvmodel/       # AI / Computer vision model
│   │   ├── users/         # User management
│   │   ├── manage.py
│   │   ├── requirements.txt
│   │   └── .env.example   # Environment variables template
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Prerequisites

- [![Node.js](https://skillicons.dev/icons?i=nodejs&theme=light)](https://nodejs.org) Node.js 18+
- npm or yarn
- [![Python](https://skillicons.dev/icons?i=python&theme=light)](https://www.python.org) Python 3.10+
- **Expo Go** app on your phone — [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- A **Gemini API key** — get one for free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Patrickdoch130207/Hack4Community_SOULWARE.git
cd Hack4Community_SOULWARE/ecobin-app
```

Install frontend dependencies:

```bash
npm install
```

---

## Running the app with Expo Go

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone.
Make sure your phone and computer are on the same Wi-Fi network.

---

## Running the backend

**Create and activate a virtual environment:**

```bash
cd backend
python3 -m venv venv

# Linux / Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Set up environment variables:**

```bash
cp .env.example .env
```

Then open the `.env` file and fill in your keys:

```dotenv
# Get your free Gemini API key at https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Django secret key
SECRET_KEY=your_django_secret_key_here

DEBUG=True
```

**Run migrations and start the server:**

```bash
python manage.py migrate
python manage.py runserver
```

---

## Team

<div align="center">

| Name | Role |
|:---|:---|
| Dieugrand Patrick DOCHAMOU | AI Engineer |
| Bénito ATIGOSSOU | Full Stack Developer |
| AGNIDE Nawarath | Team Lead · Content Creator · Designer |
| HOUETO Laurel | UI/UX Designer |

</div>

---

<div align="center">

Built for **Hack4Community** — All rights reserved to Team SOULWARE.

</div>