// 七牛JDK
'use strict';

const Service = require('egg').Service;
const Client = require('ssh2').Client;
const servers = new Client();
let conn = null;


class Ssh2Service extends Service {

    constructor(props) {
        super(props);
        this.conn = null;
    }

    async init() {
        if (!conn) {
            conn = await this.connect();
            const loop = () => { conn = null; };
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
                host: '111.230.186.207',
                port: '65522',
                username: 'root',
                password: '01vzFPu83xPbv',
            });
        });
    }

    // 执行linux命令和shell脚本
    // 例如：exec('bash /data/down/app.sh')
    async exec(exec) {
        await this.init();
        return new Promise(resolve => {
            conn.exec(exec, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    conn.end();
                    resolve({});
                }).on('data', data => {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', data => {
                    console.log('STDERR: ' + data);
                });
            });
        });
    }

    // 执行linux命令
    // 例如 shell('ll -a')
    async shell(shell) {
        await this.init();
        return new Promise(resolve => {
            conn.shell((err, stream) => {
                if (err) throw err;
                stream.on('close', () => {
                    console.log('Stream+++++ :: close');
                    conn.end();
                    resolve({});
                }).on('data', data => {
                    console.log('STDOUT+++++: ' + data);
                }).stderr.on('data', data => {
                    console.log('STDERR+++++: ' + data);
                });
                stream.end(shell);
            });
        });
    }
}

module.exports = Ssh2Service;
