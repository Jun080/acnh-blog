# Archipel ACNH - Blog Animal Crossing

Un blog communautaire pour partager vos découvertes, astuces et trouvailles dans **Animal Crossing: New Horizons**.

## Thème
Archipel ACNH est un espace dédié aux fans d'Animal Crossing qui souhaitent partager leurs expériences insulaires, leurs créations et leurs découvertes sur les villageois, la décoration et la faune du jeu.

---
## Stack Technique
### Frontend
- React 18
- Tailwind CSS
- React Router

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (authentification)
- Multer (upload d'images)

---
## Prérequis
- Node.js v16+ et npm
- Docker et Docker Compose

---
## Installation
### 1. Cloner le repository
```bash
git clone https://github.com/Jun080/acnh-blog
```

### 2. Backend
#### Installer les dépendances
```bash
cd backend
npm install
```

#### Créer le fichier `.env`
```bash
# backend/.env
PORT=3000
ENVIRONNEMENT=development
MONGODB_URI=mongodb://localhost:27017/blog_mern
JWT_SECRET=votre-secret-super-long-et-securise
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

#### Lancer MongoDB avec Docker
```bash
docker-compose up -d
```

#### Démarrer le serveur
```bash
npm run dev
```

Le backend est accessible sur **http://localhost:3000**

### 3. Frontend
#### Installer les dépendances
```bash
cd ../frontend
npm install
```

#### Créer le fichier `.env`
```bash
# frontend/.env
PORT=3001
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_UPLOADS_URL=https://acnh-blog.onrender.com/uploads
```

#### Démarrer le serveur
```bash
npm start
```

Le frontend est accessible sur **http://localhost:3001**

---
## Structure du Projet
```
Projet 1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── docker-compose.yaml
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── img/
│   │   │   ├── icons/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   ├── pages/
│   │   │   ├── components/
│   │   ├── style/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.css
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
└── test.http
