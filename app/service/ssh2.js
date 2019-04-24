// 七牛JDK
'use strict';

const Service = require('egg').Service;
const Client = require('ssh2').Client;
const conn = new Client();

class Ssh2Service extends Service {
    constructor(props){
        super(props)
        this.conn = null;
    }

    async init(json={
        host: '111.230.186.207',
        port: '65522',
        username: 'root',
        password: '1vzFPu83xPbv'
    }) {
        return new Promise((resolve,reject)=>{
            conn.on('ready', function () {
                resolve(conn);
            }).connect({
                host: json.host,
                port: json.port,
                username: json.username,
                password: json.password,
            });
        })
    }

    async exec() {
        await this.init();
        conn.exec('bash /data/down/app.sh', function (err, stream) {
            if (err) throw err;
            stream.on('close', function (code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            }).on('data', function (data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function (data) {
                console.log('STDERR: ' + data);
            });
        });
    }

    async shell() {
        await this.init();
        conn.shell(function (err, stream) {
            if (err) throw err;
            stream.on('close', function () {
                console.log('Stream+++++ :: close');
                conn.end();
            }).on('data', function (data) {
                console.log('STDOUT+++++: ' + data);
            }).stderr.on('data', function (data) {
                console.log('STDERR+++++: ' + data);
            });
            stream.end('ls -a');
        });
    }
}

module.exports = Ssh2Service;



