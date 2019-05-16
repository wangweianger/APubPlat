// 七牛JDK
'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');

class BuildService extends Service {

    // init 初始化
    async generateBuildConfig(id, taskItem = {}, assetslist = []) {
        let file = '';
        let paths = '/';
        if (taskItem.shell_path && taskItem.shell_path.indexOf('/') > -1) {
            file = path.basename(taskItem.shell_path);
            paths = path.dirname(taskItem.shell_path);
        } else {
            throw new Error('shell脚本地址必须以/开头!');
        }

        taskItem.shell_write_type = taskItem.shell_write_type ? parseInt(taskItem.shell_write_type) : 1;
        taskItem.shell_body = taskItem.shell_body.replace(/\r\n/g, '\n');

        // 本地创建文件
        if (taskItem.shell_write_type === 1) fs.writeFileSync(path.resolve(__dirname, '../tempFile/' + file), taskItem.shell_body);

        // 发布到相应服务器
        const result = [];
        for (let i = 0; i < assetslist.length; i++) { result.push(this.genConfigsForSsh(paths, file, assetslist[i], taskItem)); }
        const data = await Promise.all(result);
        // 删除本地文件
        if (taskItem.shell_write_type === 1) fs.unlinkSync(path.resolve(__dirname, '../tempFile/' + file));
        return data;
    }

    // 脚本备份
    async backupApplications(taskItem = {}, assetslist = []) {
        const bakList = [];
        for (let i = 0; i < assetslist.length; i++) {
            bakList.push(Promise.resolve(this.backUpProject(taskItem, assetslist[i])));
        }
        const result = await Promise.all(bakList);
        return result;
    }

    // 文件备份
    async backUpProject(taskItem, assets) {
        const { outer_ip, port, user, password } = assets;
        const { project_path, backups_path } = taskItem;
        return new Promise((resolve, reject) => {
            const Client = require('ssh2-sftp-client');
            const sftp = new Client();
            sftp.connect({
                host: outer_ip,
                username: user,
                port,
                password,
            })
                .then(() => {
                    const dateStr = this.app.format(new Date(), 'yyyy-MM-dd:hh:mm:ss');
                    const sh = `mkdir -p ${backups_path} && cp -r ${project_path} ${backups_path}/bak_${dateStr}`;
                    let str = '';

                    sftp.client.exec(sh, (err, stream) => {
                        if (err) throw err;
                        stream.on('close', code => {
                            resolve({
                                shell: sh,
                                data: str,
                                code,
                            });
                            sftp.client.end();
                        }).on('data', data => {
                            str = str + data;
                        }).stderr.on('data', data => {
                            str = str + data;
                        });
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    // 上传文件
    async genConfigsForSsh(paths, file, asstesItem, taskItem) {
        return new Promise((resolve, reject) => {
            const Client = require('ssh2-sftp-client');
            const sftp = new Client();
            sftp.connect({
                host: asstesItem.outer_ip,
                port: asstesItem.port,
                username: asstesItem.user,
                password: asstesItem.password,
            })
                .then(() => {
                    return sftp.exists(paths);
                })
                .then(data => {
                    if (!data) return sftp.mkdir(paths, true);
                    return 1;
                })
                .then(() => {
                    if (taskItem.shell_write_type === 1) {
                        return sftp.fastPut(path.resolve(__dirname, '../tempFile/' + file), taskItem.shell_path);
                    } else if (taskItem.shell_write_type === 2) {
                        taskItem.shell_body = taskItem.shell_body.replace(/'/g, '"');
                        return this.exec(sftp, "echo '" + taskItem.shell_body + "' > " + taskItem.shell_path);
                    }
                })
                .then(data => {
                    resolve(data);
                    sftp.end();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    exec(sftp, shell) {
        return new Promise((resolve, reject) => {
            let str = '';
            sftp.client.exec(shell, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }
                stream.on('close', code => {
                    return resolve(str || true);
                }).on('data', data => {
                    str += data;
                }).stderr.on('data', data => {
                    str += data;
                });
            });
            return undefined;
        });
    }
}

module.exports = BuildService;
