// 七牛JDK
'use strict';

const Client = require('ssh2-sftp-client');
const servers = new Client();
const sftp = {};

class Sftp {
    constructor() {
        this.host = '';
        this.port = '';
        this.username = '';
        this.password = '';
    }

    // init 初始化
    async init(json = {}) {
        this.host = json.host;
        this.port = json.port;
        this.username = json.username;
        this.password = json.password;
        await this.connectStatus();
    }

    async connectStatus() {
        if (!sftp[this.host]) {
            sftp[this.host] = await this.connect();
            const loop = () => { sftp[this.host] = null; };
            servers.on('end', loop);
            servers.on('error', loop);
        }
    }

    async connect() {
        return new Promise(resolve => {
            servers.connect({
                host: this.host,
                port: this.port,
                username: this.username,
                password: this.password,
            }).then(async () => {
                resolve(servers);
                // const result = await sftp.list('/data/down');
                // await sftp.fastGet('/data/performance/config/*.js', path.resolve(__dirname,'../../download/*.js'));
                // await sftp.mkdir('/data/down', false);
                // await sftp.fastPut(path.resolve(__dirname, '../../config/config.default.js'), '/data/down/config.default.js')
            });
        });
    }

    // 查看文件列表
    async list(remoteFilePath) {
        await this.connectStatus();
        return await sftp[this.host].list(remoteFilePath);
    }

    // 获得单个文件内容
    async get(remoteFilePath) {
        await this.connectStatus();
        return await sftp[this.host].get(remoteFilePath);
    }

    // 新增文件夹
    async mkdir(remoteFilePath, recursive) {
        await this.connectStatus();
        return await sftp[this.host].mkdir(remoteFilePath, recursive);
    }

    // 删除文件夹
    async rmdir(localPath, recursive) {
        await this.connectStatus();
        return await sftp[this.host].rmdir(localPath, recursive);
    }

    // 下载文件
    async fastGet(remotePath, localPath) {
        await this.connectStatus();
        return await sftp[this.host].fastGet(remotePath, localPath);
    }

    // 上传文件
    async fastPut(localPath, remotePath) {
        await this.connectStatus();
        return await sftp[this.host].fastPut(localPath, remotePath);
    }

    // 删除文件
    async delete(remoteFilePath) {
        await this.connectStatus();
        return await sftp[this.host].delete(remoteFilePath);
    }

    // 文件重命名
    async rename(remoteSourcePath, remoteDestPath) {
        await this.connectStatus();
        return await sftp[this.host].rename(remoteSourcePath, remoteDestPath);
    }

    // 文件权限更改
    async chmod(remoteDestPath, mode) {
        await this.connectStatus();
        return await sftp[this.host].chmod(remoteDestPath, mode);
    }

    // 关闭窗口
    async end() {
        await this.connectStatus();
        await sftp[this.host].end();
        sftp[this.host] = null;
        return 'success';
    }

}

module.exports = new Sftp();
