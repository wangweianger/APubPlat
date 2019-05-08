'use strict';

const Controller = require('egg').Controller;
const socket = require('../../util/socket');

class NspController extends Controller {

    async socket() {
        const { ctx } = this;
        const query = ctx.args[0];

        const type = query.type;
        switch (type) {
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
                host: data[i].item.host,
                port: data[i].item.port,
                username: data[i].item.username,
                password: data[i].item.password,
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
                initial_task: `sh ${data[i].taskitem.shell_path}\r\n`,
            });
        }
    }
}

module.exports = NspController;
