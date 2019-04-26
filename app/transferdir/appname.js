#!/bin/bash
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel -y
yum install  gcc perl-ExtUtils-MakeMaker -y
mkdir /home/admin/soft -p && cd  /home/admin/soft
wget http://www.morning-star.cn/git-2.0.5.tar.gz
tar xzf git-2.0.5.tar.gz
cd git-2.0.5
make prefix=/usr/local/git all
make prefix=/usr/local/git install
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
source /etc/bashrc

wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | NVM_DIR=/usr/local/nvm bash
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/dist
echo "export NVM_DIR="/usr/local/nvm""  >> /etc/bashrc
echo "[ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh" "  >> /etc/bashrc
echo "export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/dist" >> /etc/bashrc
echo "  export PM2_HOME="/root/.pm2"" >> /home/admin/.bashrc
source /etc/bashrc
source ~/.bash_profile
source /etc/bashrc
source ~/.bash_profile
nvm install 7.8.0
nvm alias default v7.8.0
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install pm2 -g
source /etc/bashrc
source ~/.bash_profile
chmod 777 /root/.nvm
chmod 777 /root/.npm
chmod 777 /root
export PM2_HOME="/root/.pm2"
chown admin:admin /root/.pm2 -R

echo '
#!/bin/bash
case "$1"  in

last)
         if [ -z "$1" ];then
        echo "please path"
        exit
        fi
         if [ -z "$2" ];then
        echo "please path"
        exit
        fi
        cp -rp /data/bak/$2  /data
;;
*)
        if [ -z "$1" ];then
        echo "please path"
        exit
        fi
         if [ -z "$2" ];then
        echo "please path"
        exit
        fi

        mkdir /data/bak/$2 -p && cp -rp /data/$2 /data/bak
        cd /data/node/$1 && git pull origin master && cnpm install && npm run online-build
;;
esac ' >> /data/push.sh


echo '
#!/bin/bash
case "$1"  in

last)
         if [ -z "$1" ];then
        echo "please path"
        exit
        fi
         if [ -z "$2" ];then
        echo "please path"
        exit
        fi
        cp -rp /usr/local/nginx/bak/$2  /usr/local/nginx
;;
*)
        if [ -z "$1" ];then
        echo "please path"
        exit
        fi
         if [ -z "$2" ];then
        echo "please path"
        exit
        fi

        mkdir /usr/local/nginx/bak/$2 -p && cp -rp /usr/local/nginx/$2 /usr/local/nginx/bak
        cd /usr/local/nginx/node/$1 && git pull origin master && cnpm install && npm run online-build
;;
esac ' >> /usr/local/nginx/push.sh
chown admin:admin /data/push.sh
chown admin:admin /usr/local/nginx/push.sh









#!/bin/bash
case "$1"  in
beifen)
        mkdir /usr/local/nginx/bak/$2 -p && cp -rp /usr/local/nginx/$2 /usr/local/nginx/bak
;;
last)
         if [ -z "$1" ];then
        echo "please path"
        exit
        fi
         if [ -z "$2" ];then
        echo "please path"
        exit
        fi
        cp -rp /usr/local/nginx/bak/$2  /usr/local/nginx
;;
*)
        if [ -z "$1" ];then
        echo "please path"
        exit
        fi
         if [ -z "$2" ];then
        echo "please path"
        exit
        fi
        groups

        #mkdir /usr/local/nginx/bak/$2 -p && cp -rp /usr/local/nginx/bak/$2 /usr/local/nginx

        cd /usr/local/nginx/node/$1 && git pull origin master && cnpm install && npm run online-build
;;
esac


