// 七牛JDK
'use strict';

const Service = require('egg').Service;
const ssh2 = require('../util/ssh2');

class UtilService extends Service {

    // 检测git环境
    async checkGitEnviron(query) {
        const ssh2Obj = new ssh2(query);
        const result = ssh2Obj.exec('git --version');
        return result;
    }

    // 安装git环境
    async installGitEnviron(query) {
        const ssh2Obj = new ssh2(query);
        const result = ssh2Obj.exec('yum -y install git');
        return result;
    }


}

module.exports = UtilService;
