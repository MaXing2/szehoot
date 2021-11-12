#!/bin/bash
if [ `whoami` != root ]; then
    echo Please run this script as root or using sudo
    exit
fi
#install
apt-get update
apt-get install curl
curl -sL https://deb.nodesource.com/setup_16.x | bash
apt-get install nodejs
#apt install mariadb-server
#systemctl start mariadb.service
#systemctl enable mariadb.service
#mysql_secure_installation

echo "----------Please config your database----------\n"
read -p "Press Enter when finished"s

#data_in
echo "----------Deployment configurator----------\n"
echo "------------Database connect--------------"
read -p "Enter database Username: " fullname

printf "Enter database password: "
stty -echo
read -r passwd
stty echo

echo "\n\n---------SMTP server setting----------"
read -p "Enter host: " host
read -p "Enter port number only: " mailport
read -p "Enter username : " authuser

printf "Enter password: "
stty -echo
read -r authpass
stty echo

echo "\n\n---------Web server port setting----------"
read -p "Enter port number only: " webport

#data_out
#database configurator
sed -i 's/szehoot/'${fullname}'/g' ./inc/db.js
sed -i 's/Szehoot2021/'${passwd}'/g' ./inc/db.js

#SMTP configurator
sed -i 's/smtp.gmail.com/'${host}'/g' ./inc/email_sender.js
sed -i 's/587/'${mailport}'/g' ./inc/email_sender.js
sed -i 's/szehoot@gmail.com/'${authuser}'/g' ./inc/email_sender.js
sed -i 's/vcHvx8nj6mrwxMQ/'${authpass}'/g' ./inc/email_sender.js

#Web port configurator
sed -i 's/3000/'${webport}'/g' ./bin/www

echo "---------successful setup----------"

#npm
npm install
npm run start