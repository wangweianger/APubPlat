// 七牛JDK
'use strict';

const Client = require('ssh2').Client;
const servers = new Client();
const conn = {};

class Ssh2 {

    constructor() {
        this.host = '';
        this.port = '';
        this.username = '';
        this.password = '';
    }

    async init(json = {}) {
        this.host = json.host;
        this.port = json.port;
        this.username = json.username;
        this.password = json.password;
        await this.connectStatus();
    }

    async connectStatus() {
        if (!conn[this.host]) {
            conn[this.host] = await this.connect();
            const loop = () => { conn[this.host] = null; };
            servers.on('end', loop);
            servers.on('error', loop);
        }
    }

    // 链接
    async connect() {
        return new Promise(resolve => {
            servers.on('ready', () => {
                resolve(servers);
            }).connect({
                host: this.host,
                port: this.port,
                username: this.username,
                password: this.password,
            });
        });
    }

    // 执行linux命令和shell脚本
    // 例如：exec('bash /data/down/app.sh')
    async exec(exec) {
        await this.connectStatus();
        return new Promise(resolve => {
            let str = '';
            conn[this.host].exec(exec, (err, stream) => {
                if (err) throw err;
                stream.on('close', code => {
                    // conn[this.host].end();
                    if (code === 0) {
                        resolve(str);
                    } else {
                        resolve('');
                    }
                }).on('data', data => {
                    str += data;
                }).stderr.on('data', data => {
                    str += data;
                });
            });
        });
    }

    // 执行linux命令
    // 例如 shell('ll -a')
    async shell(shell) {
        await this.connectStatus();
        return new Promise(resolve => {
            let str = '';
            conn[this.host].shell((err, stream) => {
                if (err) throw err;
                stream.on('close', code => {
                    // conn[this.host].end();
                    if (code === 0) {
                        resolve(str);
                    } else {
                        resolve('');
                    }
                }).on('data', data => {
                    str += data;
                }).stderr.on('data', data => {
                    str += data;
                });
                stream.end(shell);
            });
        });
    }

    // end
    async end() {
        if (conn[this.host]) {
            conn[this.host].end();
            conn[this.host] = null;
        }
    }
}

module.exports = new Ssh2();
