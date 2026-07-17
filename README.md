# 🎓 EduSpark — Plateforme E-learning

Plateforme e-learning complète type mini-Udemy : création, gestion et suivi de cours vidéo avec paiement intégré et certificats automatiques.

![EduSpark](https://img.shields.io/badge/status-en%20développement-orange)
![Django](https://img.shields.io/badge/Django-6.0-092E20?logo=django)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)

## 🚀 Démo en ligne

- **Frontend** : [elearning-platform.vercel.app](https://elearning-platform-opal-six.vercel.app)
- **Backend API** : [elearning-platform-wn9n.onrender.com/api](https://elearning-platform-wn9n.onrender.com/api)

> ⚠️ Le backend est hébergé sur un plan gratuit Render : la première requête après une période d'inactivité peut prendre 30-60 secondes (cold start).

## ✨ Fonctionnalités

### Rôles utilisateurs
- **Étudiant** : parcourt le catalogue, achète des cours, suit sa progression, obtient des certificats
- **Instructeur** : crée des cours, upload des vidéos/ressources, suit ses ventes et statistiques
- **Admin** : gestion complète via l'interface d'administration Django

### Cœur de la plateforme
- 🔐 Authentification sécurisée par JWT avec gestion des rôles
- 📚 Création et gestion de cours (titre, description, prix, niveau, catégorie)
- 🎥 Upload de vidéos et ressources (hébergement Cloudinary)
- ▶️ Lecteur vidéo avec sauvegarde automatique de la progression
- 💳 Paiement sécurisé via Stripe Checkout (mode test)
- 🏆 Génération automatique de certificats PDF à la complétion d'un cours
- ⭐ Système d'avis et de notes sur les cours
- 🔒 Blocage d'accès au contenu tant que le cours n'est pas payé
- 📊 Dashboards différenciés selon le rôle (étudiant / instructeur)

## 🛠️ Stack technique

### Backend
- **Django** + **Django REST Framework**
- **PostgreSQL** (production) / SQLite (développement)
- **JWT** (Simple JWT) pour l'authentification
- **Cloudinary** pour l'hébergement des médias
- **Stripe** pour les paiements
- **ReportLab** pour la génération de certificats PDF

### Frontend
- **React** (Vite)
- **TailwindCSS v4** pour le style
- **Framer Motion** pour les animations
- **Zustand** pour la gestion d'état (authentification)
- **React Router** pour la navigation
- **Axios** pour les appels API

### Déploiement
- **Backend** : Render (Web Service + PostgreSQL)
- **Frontend** : Vercel

## 📁 Structure du projet
elearning-platform/
├── backend/
│   ├── config/              # Configuration Django principale
│   ├── users/                # Authentification, rôles, profils
│   ├── courses/               # Cours, leçons, catégories, ressources
│   ├── payments/               # Intégration Stripe (checkout + webhook)
│   ├── certificates/            # Génération de certificats PDF
│   ├── progress/                 # Suivi de progression vidéo
│   ├── reviews/                    # Avis et notes
│   ├── build.sh                     # Script de build pour Render
│   └── requirements.txt
│
└── frontend/
├── src/
│   ├── components/       # Composants réutilisables (UI, layout)
│   ├── pages/              # Pages par rôle (public, auth, student, instructor)
│   ├── services/            # Appels API (axios)
│   ├── store/                 # État global (Zustand)
│   ├── hooks/                   # Hooks personnalisés
│   └── utils/                     # Fonctions utilitaires
└── vercel.json               # Config de rewrite SPA


## ⚙️ Installation en local

### Prérequis
- Python 3.11+
- Node.js 18+
- Compte Cloudinary (gratuit)
- Compte Stripe (mode test)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

pip install -r requirements.txt
```

Crée un fichier `.env` à la racine de `backend/` :

```env
SECRET_KEY=ta_cle_secrete
DEBUG=True

CLOUDINARY_CLOUD_NAME=ton_cloud_name
CLOUDINARY_API_KEY=ta_cle_api
CLOUDINARY_API_SECRET=ton_secret_api

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Test des paiements Stripe en local

Installe [Stripe CLI](https://stripe.com/docs/stripe-cli), puis :

```bash
stripe listen --forward-to localhost:8000/api/payments/webhook/
```

Utilise la carte de test : `4242 4242 4242 4242`, n'importe quelle date future, n'importe quel CVC.

## 🔑 Variables d'environnement

### Backend (Render)
| Variable | Description |
|---|---|
| `SECRET_KEY` | Clé secrète Django |
| `DEBUG` | `False` en production |
| `ALLOWED_HOSTS` | Domaine du backend |
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `CORS_ALLOWED_ORIGINS` | URL du frontend (sans slash final) |
| `FRONTEND_URL` | URL du frontend pour les redirections Stripe |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Identifiants Cloudinary |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Identifiants Stripe |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_URL` | URL de l'API backend |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloud name (upload direct) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Preset non signé pour l'upload direct |

## 🧪 Comptes de test

| Rôle | Username | Mot de passe |
|---|---|---|
| Instructeur | `demo_instructor` | à créer via `/register` |
| Étudiant | `demo_student` | à créer via `/register` |

## 📝 Licence

Projet réalisé à des fins de démonstration et de portfolio.

## 👤 Auteur

Développé par **[boudersa kaouther]** · [LinkedIn]([https://linkedin.com/in/to](https://www.linkedin.com/in/kaouther-b-98256939b/)i) · [GitHub](https://github.com/iramme)
