'use strict';

const Controller = require('egg').Controller;

class UtilController extends Controller {

    // 检测服务器是否安装git环境
    async checkGitEnviron() {
        const { ctx } = this;
        const query = ctx.request.body;
        const { host, port, username, password } = query;
        if (!host) throw new Error('资产host不能为空!');
        if (!port) throw new Error('资产port不能为空!');
        if (!username) throw new Error('资产username不能为空!');
        if (!password) throw new Error('资产password不能为空!');

        const result = await this.ctx.service.util.checkGitEnviron(query);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 安装git环境
    async installGitEnviron() {
        const { ctx } = this;
        const query = ctx.request.body;
        const { host, port, username, password } = query;
        if (!host) throw new Error('资产host不能为空!');
        if (!port) throw new Error('资产port不能为空!');
        if (!username) throw new Error('资产username不能为空!');
        if (!password) throw new Error('资产password不能为空!');

        const result = await this.ctx.service.util.installGitEnviron(query);

        ctx.body = this.app.result({
            data: result,
        });
    }

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

}

module.exports = UtilController;
