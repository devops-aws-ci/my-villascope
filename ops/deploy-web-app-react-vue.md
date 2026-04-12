## Clone git code initial

mkdir projects
cd /root/projects

git clone https://`<token>`@github.com/devops-aws-ci/my-villascope.git

## Update and re-Build new version of prod app react

```bash
sudo su -

cd /mnt/c/myworkspace/personel-repos/My-VillaScope
source ~/myenv_py3/bin/activate

npm install
npm install xlsx
npm run dev

# get last version of code from git repos
git stash
git pull origin
npm install
npm run build
// npm run preview
# Ça génère un dossier "dist/" avec tous les fichiers statiques (HTML, JS, CSS). C'est ça qu'on va servir en production — pas vite dev.
ls -la /root/projects/My-Bankin/dist
# Par défaut, le dossier /root est interdit d'accès à l'utilisateur www-data (Nginx). C'est la cause la plus fréquente de Gateway Timeout avec une config correcte.

# Copier le dist dans un dossier accessible
sudo cp -r dist/* /var/www/mybankin/
# restart web server nginx
sudo systemctl reload nginx

# check web server url 
curl http://ec2-18-200-174-106.eu-west-1.compute.amazonaws.com/


## in new shell console

cd /mnt/c/myworkspace/personel-repos/my-villascope/backoffice
source ~/myenv_py3/bin/activate
npm install express cors
npm install cors
npm run build
node backup-server &

ps aux | grep backup-server
pkill -f backup-server
pkill -f "node backup-server" 
lsof -i :3001
kill process_id

curl -X POST http://localhost:3001/api/save \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

curl -X POST http://localhost:3001/api/save \
  -H "Content-Type: application/json" \
  -d '{"projects":[{"id":"test","name":"Test"}],"activeProjectId":"test"}'

{"ok":true,"savedAt":"2026-04-12T18:34:18.421Z","fileSize":285,"backupCreated":"villascope_complet_data_20260412_203418.json"}



```



cd /root/projects/my-villascope
git stash
git pull origin

cd /root/projects/my-villascope
sudo cp /root/projects/my-villascope/ops/config/myvillascope.nginx.conf /etc/nginx/sites-available/myvillascope
 
sudo ln -s /etc/nginx/sites-available/myvillascope /etc/nginx/sites-enabled/myvillascope

# Valider la config
sudo nginx -t

# Recharger nginx
sudo systemctl reload nginx