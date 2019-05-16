'use strict';

const Controller = require('egg').Controller;
const socket = require('../../util/socket');

class NspController extends Controller {

    async socket() {
        const { ctx } = this;
        const query = ctx.args[0];

        const buildType = query.buildType;
        switch (buildType) {
        case 'buildprocess':
            this.buildProcess(query.data);
            break;
        case 'buildtasks':
            this.buildProcess(query.data);
            break;
        default:
        }
    }

    // 应用构建
    async buildProcess(data = []) {
        if (!data.length) return;
        const { ctx } = this;
        const result = [];
        for (let i = 0; i < data.length; i++) {
            let shell = '';
            if (data[i].taskItem && data[i].taskItem.task_type) {
                shell = data[i].taskItem.task_type !== 'command' ?
                    `sh ${data[i].taskItem.shell_path} ${data[i].taskItem.shell_opction || ''} \r\n` :
                    data[i].taskItem.shell_body + '\r\n';
            }
            const item = Promise.resolve(
                this.backUpProject(data[i]).then(() => {
                    socket({
                        host: data[i].assitsItem.host,
                        port: data[i].assitsItem.port,
                        username: data[i].assitsItem.username,
                        password: data[i].assitsItem.password,
                        cols: 138,
                        rows: 46,
                        term: 'xterm-color',
                        socket: {
                            socket: ctx.socket,
                            geometry: data[i].geometry,
                            close: data[i].close,
                            data: data[i].data,
                            end: data[i].end,
                            resize: data[i].resize,
                        },
                        initial_task: shell,
                    });
                })
            );
            result.push(item);
        }
        await Promise.all(result);
    }

    // 备份
    async backUpProject(data) {
        const { host, port, username, password } = data.assitsItem;
        const { is_backups, project_path, backups_path } = data.taskItem;
        let promise = null;
        if (data.taskItem && is_backups && project_path && backups_path) {
            promise = new Promise((resolve, reject) => {
                const Client = require('ssh2-sftp-client');
                const sftp = new Client();
                sftp.connect({
                    host,
                    port,
                    username,
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
        } else {
            promise = new Promise(resolve => { resolve(1); });
        }
        return promise;
    }

}

module.exports = NspController;
