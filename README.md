# 🍳 Cook Memory

**Ton carnet de recettes personnel, moderne et privé.**

Cook Memory est une application web fullstack qui te permet de sauvegarder, organiser et retrouver facilement toutes tes recettes. Fini les screenshots perdus et les carnets gribouillés — tout est centralisé, filtrable et accessible depuis n'importe quel appareil.

---

## Fonctionnalités

- **Gestion complète des recettes** — Crée, modifie et supprime tes recettes avec titre, description, ingrédients, étapes, temps de préparation/cuisson, nombre de portions et niveau de difficulté.
- **Upload de photos** — Ajoute plusieurs images par recette (JPG, PNG, WebP, AVIF, max 5 Mo), stockées sur Vercel Blob.
- **Catégories** — Classe tes recettes par type : Entrée, Plat, Dessert, Apéro, Boisson, Petit-déjeuner, Sauce, Accompagnement.
- **Tags** — Étiquette tes recettes avec des tags personnalisés (Végétarien, Rapide, Été, Comfort food, Healthy, Sans gluten…) et crée les tiens.
- **Favoris** — Marque tes recettes préférées d'un cœur pour les retrouver instantanément.
- **Recherche & filtres** — Recherche par titre, description ou ingrédient. Filtre par catégorie, difficulté et tag, le tout combinable.
- **Authentification sécurisée** — Connexion par email/mot de passe avec hachage bcrypt et sessions JWT via NextAuth.js v5.
- **Interface responsive** — Sidebar desktop + barre de navigation mobile, le tout avec un design épuré.
- **Page paramètres** — Changement de mot de passe depuis l'application.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack) |
| Langage | [TypeScript](https://www.typescriptlang.org) |
| API | [tRPC 11](https://trpc.io) (API type-safe de bout en bout) |
| Base de données | [PostgreSQL](https://www.postgresql.org) |
| ORM | [Prisma 6](https://prisma.io) |
| Authentification | [NextAuth.js v5 (beta)](https://next-auth.js.org) + Credentials |
| Stockage images | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| UI | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Icônes | [Hugeicons React](https://hugeicons.com) + [Lucide React](https://lucide.dev) |
| Validation | [Zod](https://zod.dev) |
| Data fetching | [TanStack React Query 5](https://tanstack.com/query) |
| Scaffolding | [create-t3-app](https://create.t3.gg) |
| Package manager | [pnpm](https://pnpm.io) |

---

## Prérequis

- **Node.js** ≥ 18
- **pnpm** ≥ 10
- **PostgreSQL** en local ou distant (ou Docker)
- Un compte **Vercel** pour le Blob storage (ou un token Blob)

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/<ton-username>/cook-memory.git
cd cook-memory
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer l'environnement

Copie le fichier d'exemple et remplis les valeurs :

```bash
cp .env.example .env
```

Variables à renseigner dans `.env` :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/cook-memory"

# NextAuth — génère un secret avec : npx auth secret
AUTH_SECRET="ton-secret-ici"

# Vercel Blob (pour l'upload d'images)
BLOB_READ_WRITE_TOKEN="ton-token-vercel-blob"
```

### 4. Lancer la base de données

**Option A — Avec Docker (recommandé) :**

```bash
./start-database.sh
```

Ce script crée un conteneur PostgreSQL avec les bonnes variables. Il propose de générer un mot de passe aléatoire si tu utilises le mot de passe par défaut.

**Option B — PostgreSQL existant :**

Assure-toi que ta base `cook-memory` existe et que `DATABASE_URL` pointe dessus.

### 5. Appliquer le schéma et seeder

```bash
# Appliquer les migrations (ou pousser le schéma)
pnpm db:push

# Seeder les données initiales (catégories, tags, recettes exemples)
pnpm dlx tsx prisma/seed.ts
```

### 6. Lancer le serveur de développement

```bash
pnpm dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Démarre le serveur de dev avec Turbopack |
| `pnpm build` | Build de production |
| `pnpm start` | Lance le serveur de production |
| `pnpm preview` | Build + lance en production |
| `pnpm check` | Lint + typecheck |
| `pnpm lint` | ESLint |
| `pnpm lint:fix` | ESLint avec auto-fix |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm format:check` | Vérifie le formatage Prettier |
| `pnpm format:write` | Formate le code avec Prettier |
| `pnpm db:push` | Pousse le schéma Prisma vers la BDD |
| `pnpm db:generate` | Crée une migration Prisma |
| `pnpm db:migrate` | Applique les migrations en production |
| `pnpm db:studio` | Ouvre Prisma Studio (interface graphique BDD) |

---

## Structure du projet

```
cook-memory/
├── prisma/
│   ├── schema.prisma        # Schéma de la base de données
│   └── seed.ts              # Données initiales (catégories, tags, recettes)
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                  # Routes Next.js (App Router)
│   │   ├── api/
│   │   │   ├── auth/         # Route NextAuth
│   │   │   └── upload/       # Route upload d'images (Vercel Blob)
│   │   ├── favorites/        # Page des favoris
│   │   ├── login/            # Page de connexion
│   │   ├── recipes/
│   │   │   ├── [id]/         # Détail + édition d'une recette
│   │   │   └── new/          # Création d'une recette
│   │   ├── search/           # Page de recherche
│   │   ├── settings/         # Paramètres (changement de mot de passe)
│   │   ├── layout.tsx        # Layout racine
│   │   └── page.tsx          # Page d'accueil (liste des recettes)
│   ├── components/
│   │   ├── layout/
│   │   │   └── nav.tsx       # Navigation (sidebar desktop + bottom bar mobile)
│   │   ├── recipes/
│   │   │   ├── image-upload.tsx    # Composant d'upload d'images
│   │   │   ├── recipe-card.tsx     # Carte de recette
│   │   │   ├── recipe-filters.tsx  # Barre de recherche + filtres
│   │   │   └── recipe-form.tsx     # Formulaire création/édition
│   │   └── ui/               # Composants shadcn/ui
│   ├── env.js                # Validation des variables d'environnement (Zod)
│   ├── middleware.ts         # Protection des routes (auth)
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   ├── category.ts   # Router tRPC catégories
│   │   │   │   ├── recipe.ts     # Router tRPC recettes (CRUD, favoris)
│   │   │   │   ├── tag.ts        # Router tRPC tags
│   │   │   │   └── user.ts       # Router tRPC utilisateur (mot de passe)
│   │   │   ├── root.ts       # Router racine tRPC
│   │   │   └── trpc.ts       # Configuration tRPC (contexte, middlewares)
│   │   ├── auth/
│   │   │   ├── config.ts     # Config NextAuth complète
│   │   │   ├── config.edge.ts # Config minimale pour le middleware Edge
│   │   │   └── index.ts      # Export auth, handlers, signIn, signOut
│   │   └── db.ts             # Instance Prisma
│   └── trpc/                 # Client tRPC (React + serveur)
├── .env.example
├── .gitignore
├── package.json
├── start-database.sh         # Script de lancement PostgreSQL via Docker
└── tsconfig.json
```

---

## Modèle de données

```
User ──< Recipe ──< Ingredient
  │         │──< Step
  │         │──< RecipeImage
  │         │──< RecipeTag >── Tag
  │         └──< Favorite
  └──< Favorite

Category ──< Recipe
```

**Modèles principaux :**

- **User** — Utilisateur avec email, mot de passe hashé, sessions.
- **Recipe** — Titre, description, temps de prép/cuisson, portions, difficulté (EASY / MEDIUM / HARD).
- **Ingredient** — Nom, quantité (string flexible pour "1/2", "un peu"), unité, ordre.
- **Step** — Instruction textuelle avec ordre.
- **Category** — Classement principal (Entrée, Plat, Dessert…).
- **Tag** — Étiquettes libres, relation many-to-many via RecipeTag.
- **Favorite** — Relation User ↔ Recipe.
- **RecipeImage** — URL de l'image (Vercel Blob), texte alternatif, ordre.

---

## Déploiement

### Vercel (recommandé)

1. Connecte ton dépôt GitHub à [Vercel](https://vercel.com).
2. Configure les variables d'environnement dans le dashboard Vercel : `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`.
3. Utilise une base PostgreSQL managée (Vercel Postgres, Neon, Supabase…).
4. Vercel détecte automatiquement Next.js et lance le build.

### Docker

Consulte la documentation de [create-t3-app sur Docker](https://create.t3.gg/en/deployment/docker).

---

## Contribuer

1. Fork le projet
2. Crée ta branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit tes changements (`git commit -m "feat: ajout de ma fonctionnalité"`)
4. Push (`git push origin feature/ma-fonctionnalite`)
5. Ouvre une Pull Request

---

## Licence

Projet privé. Tous droits réservés.
Copie le fichier d'exemple et remplis les valeurs :

```bash
cp .env.example .env
```

Variables à renseigner dans `.env` :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/cook-memory"

# NextAuth — génère un secret avec : npx auth secret
AUTH_SECRET="ton-secret-ici"

# Vercel Blob (pour l'upload d'images)
BLOB_READ_WRITE_TOKEN="ton-token-vercel-blob"
```

### 4. Lancer la base de données

**Option A — Avec Docker (recommandé) :**

```bash
./start-database.sh
```

Ce script crée un conteneur PostgreSQL avec les bonnes variables. Il propose de générer un mot de passe aléatoire si tu utilises le mot de passe par défaut.

**Option B — PostgreSQL existant :**

Assure-toi que ta base `cook-memory` existe et que `DATABASE_URL` pointe dessus.

### 5. Appliquer le schéma et seeder

```bash
# Appliquer les migrations (ou pousser le schéma)
pnpm db:push

# Seeder les données initiales (catégories, tags, recettes exemples)
pnpm dlx tsx prisma/seed.ts
```

### 6. Lancer le serveur de développement

```bash
pnpm dev
    ```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Démarre le serveur de dev avec Turbopack |
| `pnpm build` | Build de production |
| `pnpm start` | Lance le serveur de production |
| `pnpm preview` | Build + lance en production |
| `pnpm check` | Lint + typecheck |
| `pnpm lint` | ESLint |
| `pnpm lint:fix` | ESLint avec auto-fix |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm format:check` | Vérifie le formatage Prettier |
| `pnpm format:write` | Formate le code avec Prettier |
| `pnpm db:push` | Pousse le schéma Prisma vers la BDD |
| `pnpm db:generate` | Crée une migration Prisma |
| `pnpm db:migrate` | Applique les migrations en production |
| `pnpm db:studio` | Ouvre Prisma Studio (interface graphique BDD) |

---

## Structure du projet


cook-memory/
├── prisma/
│   ├── schema.prisma        # Schéma de la base de données
│   └── seed.ts              # Données initiales (catégories, tags, recettes)
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                  # Routes Next.js (App Router)
│   │   ├── api/
│   │   │   ├── auth/         # Route NextAuth
│   │   │   └── upload/       # Route upload d'images (Vercel Blob)
│   │   ├── favorites/        # Page des favoris
│   │   ├── login/            # Page de connexion
│   │   ├── recipes/
│   │   │   ├── [id]/         # Détail + édition d'une recette
│   │   │   └── new/          # Création d'une recette
│   │   ├── search/           # Page de recherche
│   │   ├── settings/         # Paramètres (changement de mot de passe)
│   │   ├── layout.tsx        # Layout racine
│   │   └── page.tsx          # Page d'accueil (liste des recettes)
│   ├── components/
│   │   ├── layout/
│   │   │   └── nav.tsx       # Navigation (sidebar desktop + bottom bar mobile)
│   │   ├── recipes/
│   │   │   ├── image-upload.tsx    # Composant d'upload d'images
│   │   │   ├── recipe-card.tsx     # Carte de recette
│   │   │   ├── recipe-filters.tsx  # Barre de recherche + filtres
│   │   │   └── recipe-form.tsx     # Formulaire création/édition
│   │   └── ui/               # Composants shadcn/ui
│   ├── env.js                # Validation des variables d'environnement (Zod)
│   ├── middleware.ts         # Protection des routes (auth)
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   ├── category.ts   # Router tRPC catégories
│   │   │   │   ├── recipe.ts     # Router tRPC recettes (CRUD, favoris)
│   │   │   │   ├── tag.ts        # Router tRPC tags
│   │   │   │   └── user.ts       # Router tRPC utilisateur (mot de passe)
│   │   │   ├── root.ts       # Router racine tRPC
│   │   │   └── trpc.ts       # Configuration tRPC (contexte, middlewares)
│   │   ├── auth/
│   │   │   ├── config.ts     # Config NextAuth complète
│   │   │   ├── config.edge.ts # Config minimale pour le middleware Edge
│   │   │   └── index.ts      # Export auth, handlers, signIn, signOut
│   │   └── db.ts             # Instance Prisma
│   └── trpc/                 # Client tRPC (React + serveur)
├── .env.example
├── .gitignore
├── package.json
├── start-database.sh         # Script de lancement PostgreSQL via Docker
└── tsconfig.json


---

## Modèle de données


User ──< Recipe ──< Ingredient
  │         │──< Step
  │         │──< RecipeImage
  │         │──< RecipeTag >── Tag
  │         └──< Favorite
  └──< Favorite

Category ──< Recipe


**Modèles principaux :**

- **User** — Utilisateur avec email, mot de passe hashé, sessions.
- **Recipe** — Titre, description, temps de prép/cuisson, portions, difficulté (EASY / MEDIUM / HARD).
- **Ingredient** — Nom, quantité (string flexible pour "1/2", "un peu"), unité, ordre.
- **Step** — Instruction textuelle avec ordre.
- **Category** — Classement principal (Entrée, Plat, Dessert…).
- **Tag** — Étiquettes libres, relation many-to-many via RecipeTag.
- **Favorite** — Relation User ↔ Recipe.
- **RecipeImage** — URL de l'image (Vercel Blob), texte alternatif, ordre.

---

## Déploiement

### Vercel (recommandé)

1. Connecte ton dépôt GitHub à [Vercel](https://vercel.com).
2. Configure les variables d'environnement dans le dashboard Vercel : `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`.
3. Utilise une base PostgreSQL managée (Vercel Postgres, Neon, Supabase…).
4. Vercel détecte automatiquement Next.js et lance le build.

### Docker

Consulte la documentation de [create-t3-app sur Docker](https://create.t3.gg/en/deployment/docker).

---

## Contribuer

1. Fork le projet
2. Crée ta branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit tes changements (`git commit -m "feat: ajout de ma fonctionnalité"`)
4. Push (`git push origin feature/ma-fonctionnalite`)
5. Ouvre une Pull Request

---

## Licence

Projet privé. Tous droits réservés.
