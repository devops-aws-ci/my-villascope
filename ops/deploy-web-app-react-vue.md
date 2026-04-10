## Clone git code initial

mkdir projects
cd /root/projects

git clone https://`<token>`@github.com/devops-aws-ci/my-villascope.git

## Update and re-Build new version of prod app react

```bash
sudo su -

cd /mnt/c/myworkspace/personel-repos/My-VillaScope
source ~/myenv_py3/bin/activate

pip install git-filter-repo
npm install
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
node save-server.cjs &



```
