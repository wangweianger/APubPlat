#!/bin/bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | NVM_DIR=/usr/local/nvm bash
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/dist
echo "export NVM_DIR="/usr/local/nvm""  >> /etc/bashrc
echo "[ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh" "  >> /etc/bashrc
echo "export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/dist" >> /etc/bashrc
source /etc/bashrc
source ~/.bash_profile
source /etc/bashrc
source ~/.bash_profile
nvm install 10.15.3
nvm alias default v10.15.3
nvm use 10.15.3