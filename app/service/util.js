// 七牛JDK
'use strict';

const Service = require('egg').Service;
const ssh2 = require('../util/ssh2');

class UtilService extends Service {

    // 检测git环境
    async checkGitEnviron(query) {
        await ssh2.init(query);
        const result = await ssh2.exec('git --version');
        ssh2.end();
        return result;
    }

    // 安装git环境
    async installGitEnviron(query) {
        await ssh2.init(query);
        const result = await ssh2.exec('yum -y install git');
        ssh2.end();
        return result;
    }

    // 获得服务器的ssh key
    async getAssetSshKey(query) {
        const type = query.type * 1;
        const email = query.email;
        await ssh2.init(query);

        let result = '';
        if (type === 1) {
            // get ssh key
            result = await ssh2.exec('cat ~/.ssh/id_rsa.pub');
        } else if (type === 2) {
            // add new ssh key
            await ssh2.exec(`echo y | ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa -C "${email}"`);
            result = await ssh2.exec('cat ~/.ssh/id_rsa.pub');
        }
        ssh2.end();
        return result;
    }
}

module.exports = UtilService;
