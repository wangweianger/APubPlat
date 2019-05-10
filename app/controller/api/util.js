'use strict';

const Controller = require('egg').Controller;

class UtilController extends Controller {

    // 获得服务器ssh key
    async getAssetSshKey() {
        const { ctx } = this;
        const query = ctx.request.body;
        const { host, port, username, password } = query;
        if (!host) throw new Error('资产host不能为空!');
        if (!port) throw new Error('资产port不能为空!');
        if (!username) throw new Error('资产username不能为空!');
        if (!password) throw new Error('资产password不能为空!');

        const result = await this.ctx.service.util.getAssetSshKey(query);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 执行shell任务
    async handleShellTasks() {
        const { ctx } = this;
        const query = ctx.request.body;
        const { host, port, username, password, shell_type, shell_body, shell_path } = query;
        if (!host) throw new Error('资产host不能为空!');
        if (!port) throw new Error('资产port不能为空!');
        if (!username) throw new Error('资产username不能为空!');
        if (!password) throw new Error('资产password不能为空!');
        if (!shell_type) throw new Error('执行脚本的类型不能为空!');
        if (!shell_body) throw new Error('执行脚本的内容不能为空!');
        if (parseInt(shell_type) === 2 && !shell_path) throw new Error('执行脚本的脚本路径不能为空!');

        const result = await this.ctx.service.util.handleShellTasks(query);

        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = UtilController;
