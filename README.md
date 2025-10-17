# Wikipedia Race - Installation Docker 🐳

## 📁 Structure du projet

```
wikipedia-race/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       └── ... (votre code React)
└── README.md
```

## 🚀 Installation et lancement

### Prérequis
- Docker Desktop installé ([Télécharger ici](https://www.docker.com/products/docker-desktop))
- Docker Compose (inclus avec Docker Desktop)

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd wikipedia-race
```

### 2. Lancer avec Docker Compose
```bash
# Construction et lancement de tous les services
docker-compose up --build

# Ou en mode détaché (arrière-plan)
docker-compose up -d --build
```

### 3. Accéder à l'application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Redis**: localhost:6379

### 4. Arrêter les services
```bash
# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 🔧 Commandes utiles

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Redémarrer un service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Reconstruire un service
```bash
docker-compose up -d --build backend
```

### Accéder à un conteneur
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 🌍 Variables d'environnement

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
```

## 🔒 Configuration pour la production

### Avec un nom de domaine
Modifier `docker-compose.yml`:

```yaml
services:
  frontend:
    environment:
      - REACT_APP_API_URL=https://api.votre-domaine.com
  
  backend:
    environment:
      - CORS_ORIGIN=https://votre-domaine.com
```

### Avec HTTPS (Nginx + Certbot)
Ajouter un service nginx-proxy:

```yaml
  nginx-proxy:
    image: jwilder/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
```

## 📊 Monitoring

### Voir l'utilisation des ressources
```bash
docker stats
```

### Vérifier la santé des conteneurs
```bash
docker-compose ps
```

## 🐛 Dépannage

### Problème de port déjà utilisé
```bash
# Vérifier quel processus utilise le port
lsof -i :3000
lsof -i :3001

# Changer le port dans docker-compose.yml
ports:
  - "8080:80"  # Frontend sur port 8080
```

### Reconstruire complètement
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Nettoyer Docker
```bash
# Supprimer les conteneurs arrêtés
docker container prune

# Supprimer les images non utilisées
docker image prune -a

# Nettoyer tout
docker system prune -a --volumes
```

## 🚢 Déploiement

### Sur un serveur
```bash
# Copier les fichiers
scp -r . user@server:/path/to/app

# SSH sur le serveur
ssh user@server

# Lancer
cd /path/to/app
docker-compose up -d --build
```

### Avec Docker Hub
```bash
# Build et push
docker build -t username/wikipedia-race-backend ./backend
docker push username/wikipedia-race-backend

# Sur le serveur
docker pull username/wikipedia-race-backend
```

### Avec GitHub Actions (CI/CD)
Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull
            docker-compose up -d --build
```

## 📝 Notes

- Redis est optionnel mais recommandé pour la scalabilité
- Les volumes Docker persistent les données entre les redémarrages
- En production, utilisez des secrets pour les variables sensibles
- Configurez un reverse proxy (Nginx/Traefik) pour HTTPS

## 🔗 Liens utiles

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Socket.IO avec Docker](https://socket.io/docs/v4/docker/)
- [Best practices Docker](https://docs.docker.com/develop/dev-best-practices/)
