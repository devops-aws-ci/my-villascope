#! /bin/bash
# sudo su -
# cd /root/projects
# git clone https://tokennn@github.com/devops-aws-ci/My-Bankin.git
# git clone https://`<token>`@github.com/devops-aws-ci/my-villascope.git

cd /root/projects/my-villascope/
# get last version of code from git repos
git stash
git pull origin
# rebuild code react to html
npm install
npm run build
##
# cd /var/www/
# mkdir myvillascope

# Copier le dist dans un dossier accessible
cd /root/projects/my-villascope/
sudo cp -r dist/* /var/www/myvillascope/
ls /var/www/myvillascope/

# restart web server nginx
sudo systemctl reload nginx
# check web server url 
curl http://ec2-18-200-174-106.eu-west-1.compute.amazonaws.com/

### restart api services node exppress 
sudo systemctl daemon-reload
sudo systemctl restart mybankin-server