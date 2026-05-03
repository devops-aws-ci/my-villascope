## Prérequis

- **Node.js** >= 18 (https://nodejs.org)

install pre-requis  :

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
cd /mnt/c/myworkspace/personel-repos/my-villascope #dev
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
cd /mnt/c/myworkspace/personel-repos/my-villascope #dev
cd ~/projects/my-villascope  #prod
npm run build
npm run dev
# or
npx vite

cd /mnt/c/myworkspace/personel-repos/my-villascope/backoffice
npm install express
npm install express cors
npm install dotenv
npm install bcrypt jsonwebtoken

node setup-auth.cjs "TonMotDePasseIci"
ls -l auth.json
node backup-server.js &
ps aux | grep backup-server

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
