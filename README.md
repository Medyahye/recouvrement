<<<<<<< HEAD
# Systeme de priorisation des zones de recouvrement SNDE

Application web composee de:

- `backend/` : Django + Django REST Framework
- `frontend/` : Next.js + TypeScript + Tailwind CSS
- `PostgreSQL` : base de donnees recommandee

Le systeme permet d'importer chaque jour un fichier FAB TXT/CSV, de nettoyer les donnees, filtrer les clients avec `code_relance = 1`, calculer les scores clients et zones, comparer le FAB courant au precedent et afficher les resultats dans une interface web.

## 1. Installation backend

Depuis la racine du projet:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

Copier ensuite le fichier d'exemple:

```bash
copy .env.example .env
```

## 2. Configuration PostgreSQL

Dans `backend/.env`, definir:

```env
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

DB_ENGINE=postgresql
DB_NAME=snde_recouvrement
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

Pour un lancement rapide de demonstration sans PostgreSQL, vous pouvez utiliser:

```env
DB_ENGINE=sqlite
```

## 3. Migrations backend

```bash
cd backend
.venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
```

## 4. Lancement Django

```bash
cd backend
.venv\Scripts\activate
python manage.py runserver
```

API backend par defaut: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)

## 5. Installation frontend

```bash
cd frontend
npm install
copy .env.example .env.local
```

Verifier dans `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## 6. Lancement Next.js

```bash
cd frontend
npm run dev
```

Frontend par defaut: [http://localhost:3000](http://localhost:3000)

## 7. Endpoints API

### Imports

- `POST /api/imports/upload/`
- `GET /api/imports/`
- `GET /api/imports/latest/`
- `GET /api/imports/comparison/latest/`

### Zones

- `GET /api/zones/latest/`
- `GET /api/zones/{id}/`

Filtres supportes sur `GET /api/zones/latest/`:

- `priorite`
- `code_centre`
- `search`
- `page`

### Clients

- `GET /api/clients/latest/`

Filtres supportes:

- `zone_code`
- `code_centre`
- `activite`
- `priorite`
- `search`
- `page`

### Dashboard

- `GET /api/dashboard/latest/`

### Rapports

- `GET /api/reports/`
- `POST /api/reports/generate/`

## 8. Exemple d'utilisation

1. Demarrer PostgreSQL.
2. Demarrer Django avec `python manage.py runserver`.
3. Demarrer Next.js avec `npm run dev`.
4. Ouvrir `http://localhost:3000/import-fab`.
5. Importer un fichier FAB `.txt` ou `.csv`.
6. Verifier le resume, la comparaison avec le FAB precedent, les zones, les clients et les rapports.

## 9. Traitements metier implementes

- Detection automatique du separateur TXT/CSV
- Fallback d'encodage `utf-8` puis `latin1`
- Nettoyage des colonnes et des textes
- Filtrage sur `code_relance = 1`
- Suppression des lignes invalides ou hors plage de date
- Creation de `zone_code`
- Calcul de l'anciennete et de l'anciennete cappee
- Classification des activites
- Scoring client et scoring zone
- Comparaison du dernier FAB avec le precedent
- Generation de rapport Word et exports CSV

## 10. Fichiers importants

- `backend/imports/services/fab_processor.py`
- `backend/imports/services/import_comparison.py`
- `backend/scoring/services/activity_classifier.py`
- `backend/scoring/services/scoring_service.py`
- `backend/reports/services/report_generator.py`
- `frontend/src/app/dashboard/page.tsx`
- `frontend/src/app/import-fab/page.tsx`
- `frontend/src/app/zones/page.tsx`
- `frontend/src/app/clients/page.tsx`
- `frontend/src/app/reports/page.tsx`
=======
# recouvrement
>>>>>>> 268ec53e71c8e131a35be84eca7e580cc55edc92
