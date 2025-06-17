# NoSQLForm - Docker Setup

Ce projet est une application SvelteKit connectée à MongoDB, entièrement dockerisée.

## 🚀 Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 📦 Structure du projet

```
.
├── docker/
│   ├── Dockerfile.mongo        # Image Mongo personnalisée
│   └── mongo-init.js           # Script d'initialisation
├── Dockerfile                  # Image de l'app SvelteKit
├── docker-compose.yaml         # Composition des services
├── .env                        # Variables d'environnement
└── ...
```

## ⚙️ Lancement du projet

1. **Cloner le projet**
```bash
git clone https://github.com/Sweexou/NoSqlForm.git
cd NoSQLForm
```

2. **Construire et lancer les conteneurs**
```bash
docker-compose down -v  # (Optionnel) Nettoyage complet
docker-compose up --build
```

3. **Accéder à l'application**

- Frontend : [http://localhost:3000](http://localhost:3000)
- MongoDB : `mongodb://admin:admin123@localhost:27017/forms_db?authSource=admin`

## 🔐 Variables d'environnement

Exemple de fichier `.env` :

```
MONGO_URI=mongodb://admin:admin123@mongo:27017/forms_db?authSource=admin
JWT_SECRET=yourSuperSecretKey
```

> ⚠️ Ce fichier est monté automatiquement dans le conteneur via `docker-compose.yaml`.

## 🧼 Nettoyage

```bash
docker-compose down -v
```

## 🐞 Débogage

- Assurez-vous que le port `3000` est libre.
- Utilisez `docker logs <container_name>` pour consulter les logs.

---

Puis rdv sur `http://localhost:3000/`
