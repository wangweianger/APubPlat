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
        default:
        }
    }

    // 应用构建
    async buildProcess(data = []) {
        if (!data.length) return;
        const { ctx } = this;
        for (let i = 0; i < data.length; i++) {
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
                    resize: data[i].resize,
                },
                initial_task: `sh ${data[i].taskItem.shell_path} ${data[i].taskItem.shell_opction || ''} \r\n`,
            });
        }
    }
}

module.exports = NspController;
