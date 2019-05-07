// 七牛JDK
'use strict';

const Service = require('egg').Service;
const ssh2 = require('../util/ssh2');
const path = require('path');
const fs = require('fs');
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

    // 执行shell任务
    // 安装git环境
    async handleShellTasks(query) {
        let { host, port, username, password, shell_type, shell_body, shell_path } = query;
        let result = '';
        shell_type = shell_type * 1;
        if (shell_type === 1) {
            // 窗口运行命令
            await ssh2.init(query);
            result = await ssh2.exec(shell_body);
            ssh2.end();
        } else if (shell_type === 2) {
            // shell脚本命令
            let file = '';
            let paths = '/';
            if (shell_path && shell_path.indexOf('/') > -1) {
                file = path.basename(shell_path);
                paths = path.dirname(shell_path);
            } else {
                throw new Error('shell脚本地址必须以/开头!');
            }
            // 本地创建文件
            fs.writeFileSync(path.resolve(__dirname, '../tempFile/' + file), shell_body);
            await this.genConfigsForSsh({ paths, file, host, port, username, password, shell_path });
            // 删除
            fs.unlinkSync(path.resolve(__dirname, '../tempFile/' + file));
        }
        return {
            type: shell_type,
            result,
        };
    }

    // 上传文件
    async genConfigsForSsh(query) {
        const { paths, file, host, port, username, password, shell_path } = query;
        return new Promise((resolve, reject) => {
            const Client = require('ssh2-sftp-client');
            const sftp = new Client();
            sftp.connect({
                host,
                port,
                username,
                password,
            })
                .then(() => {
                    return sftp.exists(paths);
                })
                .then(data => {
                    if (!data) return sftp.mkdir(paths, true);
                    return 1;
                })
                .then(() => {
                    return sftp.fastPut(path.resolve(__dirname, '../tempFile/' + file), shell_path);
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

module.exports = UtilService;
