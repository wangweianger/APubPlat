'use strict';

const Controller = require('egg').Controller;

class AssetsController extends Controller {

    async list() {
        const { ctx } = this;
        const query = ctx.request.query;
        const pageNo = query.pageNo || 1;
        const pageSize = query.pageSize || this.app.config.pageSize;
        const team_code = query.team_code;
        const assets_name = query.assets_name;
        const status = query.status || '';

        const result = await this.ctx.service.assets.list(pageNo, pageSize, team_code, assets_name, status);

        ctx.body = this.app.result({
            data: result,
        });
    }

    async all() {
        const { ctx } = this;
        const result = await this.ctx.service.assets.all();

        ctx.body = this.app.result({
            data: result,
        });
    }

    // add | update
    async handle() {
        const { ctx } = this;
        const query = ctx.request.body;
        let type = query.type || 1;
        type = type * 1;
        let status = query.status || 1;
        status = status * 1;
        const name = query.name;
        const code = query.code;
        const _id = query._id;
        const team_code = query.team_code;
        const outer_ip = query.outer_ip;
        const lan_ip = query.lan_ip;
        const user = query.user;
        const port = query.port;
        const password = query.password;

        if (type === 2 && !_id) throw new Error('id参数不能为空!');
        if (!team_code) throw new Error('请选择资产所属团队!');
        if (!name) throw new Error('资产名称不能为空!');
        if (!code) throw new Error('资产编码不能为空!');
        if (!outer_ip) throw new Error('外网IP不能为空!');
        if (!lan_ip) throw new Error('外网IP不能为空!');
        if (!user) throw new Error('登录用户名不能为空!');
        if (!port) throw new Error('登录端口号不能为空!');
        if (!password) throw new Error('登录密码不能为空!');

        const result = await this.ctx.service.assets.handle({ type, name, code, status, _id, team_code, outer_ip, lan_ip, user, port, password });

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 禁用 | 启用
    async setStatus() {
        const { ctx } = this;
        const query = ctx.request.body;
        const _id = query._id;
        const status = query.status || 1;
        if (!_id) throw new Error('id参数不能为空!');

        const result = await this.ctx.service.assets.setStatus({ _id, status });

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 删除
    async delete() {
        const { ctx } = this;
        const query = ctx.request.body;
        const _id = query._id;
        if (!_id) throw new Error('id参数不能为空!');

        const result = await this.ctx.service.assets.delete(_id);

        ctx.body = this.app.result({
            data: result,
        });
    }


}

module.exports = AssetsController;
