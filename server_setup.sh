sudo apt-get update

sudo apt-get install -y wget curl htop ranger

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx


source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install rethinkdb -y
sudo cp /etc/rethinkdb/default.conf.sample /etc/rethinkdb/instances.d/instance1.conf
# sudo vim /etc/rethinkdb/instances.d/instance1.conf
sudo /etc/init.d/rethinkdb restart


sudo npm install pm2 create-react-app -g

cd /home/ubuntu/showcase2017/server && npm i
cd /home/ubuntu/showcase2017/client && npm i




