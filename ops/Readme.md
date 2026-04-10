# My-Bankin' Dashboard

Tableau de bord personnel de gestion financière — Qonto, Bankin', Linxo, Banque Postale.

# A developper rapidement must have

- Import operations revolut "Export_Revolut_account-statement_2024-11-12_2026-03-25_fr-fr_95a198.xlsx"
- ecran etat actuelle, solde actuelle des comptes bancaires
- Automatisation de la recuperations des tranasactions csv depuis les sources linxo,qonto
- changer le composant de select file pour que sa fonctionne sur android
- export excel des donuts et items de la tab "par catrgorie"
- dans l'ecarn Mapping des categories , ajouter le pouvoir de creer une nouvelle categorie et aprres l'exporter importer
- ajouter des tag sur certains transaction (exemple bilan_2026 , )
- Creation nouveau compte bancaire (import/export)
- Pouvoir editer les nouvelles transactions dans l'import linxo 'editer libelle note categorie sosu-catg OK
- Tu peux ajouter la possibilité de  trier la table des transactions récurrents par 'Nb' et "Depenses"   OK

# My-Bankin' Bug

- Bug Vue groupée par libellé (désactivée, bug de crash)
- Fix du bug lorsque on applique une categorie et une sous-catgorie sur un groupe de transactions juste la sous-catgorie est enregstré apres export
- 

# Plus tard

- import mybank-in depuis local file ou depuis url http (goole drive ou pcloud drive ...) et export aussi sur cloud drive

# My-Bankin' Features backlog idées

idées classées par valeur ajoutée pour ton usage :
🔥 Haute valeur :

Évolution mensuelle — un graphique barres empilées (recharts BarChart) par mois montrant la répartition des dépenses par catégorie. Tu verrais instantanément les tendances : "mes dépenses PRO ont explosé en octobre" ou "le logement est stable". Un 4ème onglet "📊 Évolution" dans les tabs d'analyse.
Règles de catégorisation automatique — un moteur de règles "si libellé contient X → catégorie Y". Par exemple : FREE MOBILE → Internet, TV, télécom ou TRANSAVIA → Sorties voyages. Ça remplacerait le travail manuel de recatégorisation que tu fais souvent. Sauvegardable en JSON comme les mappings.
Budget par catégorie — définir un budget mensuel par catégorie parente (ex: "Vie courante : 1 500 €/mois") et afficher une jauge de progression avec alerte visuelle quand on dépasse 80% ou 100%.

⚡ Valeur moyenne :

Comparaison M vs M-1 — un petit widget qui compare le mois en cours avec le mois précédent : variation en € et % par catégorie, avec flèches vertes/rouges.
Détection de doublons — scan automatique des transactions avec même montant + même date ±2j pour signaler les potentiels doublons entre imports Linxo / Bankin' / Op. bancaires.
Solde par compte dans le temps — un graphique ligne montrant l'évolution du solde cumulé par compte bancaire, mois par mois.

🔧 À reprendre plus tard :

📦 Vue groupée par libellé (désactivée, bug de crash)
⚙️ Règles de catégorisation auto (priorité #2)
💰 Budget par catégorie + jauges (priorité #3)
📈 Comparaison M vs M-1 (priorité #4)

## Prérequis

- **Node.js** >= 18 (https://nodejs.org)

isntall pre-requis  :

```bash
# Install  NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm -v
#Install Node.js 18.19.1
nvm install 18.19.1
node -v   # v18.19.1
# Tell NVM to use this version as the default
nvm use 18.19.1

apt install npm
npm -v    # 9.x ou +
 
```

## clean old build

```bash
rm -rf node_modules package-lock.json

npm cache clean --force
rm -rf ~/.npm/_npx

npm install --legacy-peer-deps
ls node_modules/.bin/vite
cat package.json | grep vite
ls node_modules/.bin/vite
```

## Installation

```bash
cd /mnt/c/myworkspace/personel-repos/My-KeyVault #dev
nvm use 18.19.1
npm install
npx vite
npm audit
npm fund
# npm audit fix --force

npm install xlsx

```

## Lancer en dev (host reload)

npm run dev (Vite/react app) ?

```bash
cd /mnt/c/myworkspace/personel-repos/My-KeyVault #dev
cd ~/projects/My-Bankin  #prod

npm run dev
# or
npx vite

cd /mnt/c/myworkspace/personel-repos/My-Bankin/
npm install express
npm install bcrypt jsonwebtoken

node setup-auth.cjs "TonMotDePasseIci"
ls -l auth.json

node save-server.cjs &
ps aux | grep save-server

```

→ Ouvre automatiquement http://localhost:3000

## Build Production aws ec2

# create folder app (oneshot )

sudo mkdir -p /var/www/mybankin # if folder not exsits
sudo mkdir -p /var/www/mybankin/data
sudo chown $USER:$USER /var/www/mybankin/data
sudo chown -R www-data:www-data /var/www/mybankin/
sudo chmod -R 755 /var/www/mybankin
ls -la /var/www/mybankin/

## Save fichier data mybankin

cp /var/www/mybankin/data/mybankin_complet_data.json ~/backup_data/mybankin_complet_data_$(date +%Y%m%d_%H%M).json
ls ~/backup_data

## Build in prod app react

```bash
cd /root/projects/My-Bankin
npm install
npm run build
// npm run preview
# Ça génère un dossier "dist/" avec tous les fichiers statiques (HTML, JS, CSS). C'est ça qu'on va servir en production — pas vite dev.
ls -la /root/projects/My-Bankin/dist
# Par défaut, le dossier /root est interdit d'accès à l'utilisateur www-data (Nginx). C'est la cause la plus fréquente de Gateway Timeout avec une config correcte.
# Copier le dist dans un dossier accessible
sudo cp -r dist/* /var/www/mybankin/
sudo systemctl reload nginx

```

## Configurer Nginx pour servir l'app

```bash
sudo apt install -y nginx

sudo cd /root/projects/My-Bankin
git stash
git pull origin
sudo cp ops/mybankin.nginx.conf /etc/nginx/sites-available/mybankin
sudo ln -s /etc/nginx/sites-available/mybankin /etc/nginx/sites-enabled/
#sudo rm /etc/nginx/sites-enabled/default

# restart nginx
sudo systemctl reload nginx
sudo nginx -t          # vérifie la syntaxe
sudo systemctl restart nginx

# verification nginx
sudo systemctl status nginx
sudo journalctl -u nginx --no-pager -n 20
sudo nginx -t

ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-available/mybankin


```

# Nginx répond-il localement ?

curl -I http://localhost

# 2. Vérifier les logs Nginx

// rm -f /var/log/nginx/mybankin_error.log
sudo tail -20 /var/log/nginx/mybankin_error.log

# 3. Vérifier les permissions so non erreur nginx

sudo -u www-data stat /var/www/mybankin/dist/index.html

## Build du web server rest api (post ,get) ,service api with node express  (sauvgarde and load mybankin data file + auth services)

cd /root/projects/My-Bankin
npm install express #one shot
node /root/projects/My-Bankin/save-server.cjs &

# Test sauvegarde

curl -X POST http://localhost:3001/api/save-data -H "Content-Type: application/json" -d '{"operations":[],"mappings":{},"flagged":[]}'

# Test lecture

curl http://localhost:3001/data/mybankin_complet_data.json

# Test auth

curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d '{"password":"P@ccw0rdENgie2026Bank-IN"}'

## Structure

```
mybankin/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances (React, Recharts, Vite)
├── vite.config.js          # Config Vite
├── README.md
└── src/
    ├── main.jsx            # Bootstrap React
    └── qonto_dashboard.jsx # Dashboard complet (~2500 lignes)
```

## Fonctionnalités

- Import CSV Bankin'/Linxo + Import Op. bancaires (Qonto, Banque Postale)
- Rapprochement bancaire en 6 niveaux
- Mapping des catégories (import/export JSON)
- Filtres globaux : Groupes, Comptes, Périodes, Type
- Donuts Dépenses/Revenus, Solde net par catégorie
- Édition inline catégories + notes
- Export complet CSV
