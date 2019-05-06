// 七牛JDK
'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');

class BuildService extends Service {

    // init 初始化
    async generateBuildConfig(id, item, assetslist = []) {
        let file = '';
        let paths = '/';
        if (item.shell_path && item.shell_path.indexOf('/') > -1) {
            file = path.basename(item.shell_path);
            paths = path.dirname(item.shell_path);
        } else {
            throw new Error('shell脚本地址必须以/开头!');
        }
        // 本地创建文件
        fs.writeFileSync(path.resolve(__dirname, '../tempFile/' + file), item.shell_body);
        const result = [];
        for (let i = 0; i < assetslist.length; i++) {
            result.push(this.genConfigsForSsh(paths, file, assetslist[i], item));
        }
        await Promise.all(result);
        // 删除
        fs.unlinkSync(path.resolve(__dirname, '../tempFile/' + file));
        return {};
    }

    async genConfigsForSsh(paths, file, item, item1) {
        return new Promise((resolve, reject) => {
            const Client = require('ssh2-sftp-client');
            const sftp = new Client();
            sftp.connect({
                host: item.outer_ip,
                port: item.port,
                username: item.user,
                password: item.password,
            })
                .then(() => {
                    return sftp.exists(paths);
                })
                .then(data => {
                    if (!data) return sftp.mkdir(paths, true);
                    return 1;
                })
                .then(() => {
                    return sftp.fastPut(path.resolve(__dirname, '../tempFile/' + file), item1.shell_path);
                })
                .then(() => {
                    resolve(1);
                    sftp.end();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = BuildService;
