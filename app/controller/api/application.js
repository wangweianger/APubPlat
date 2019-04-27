'use strict';

const Controller = require('egg').Controller;

class ApplicationController extends Controller {

    async list() {
        const { ctx } = this;
        const query = ctx.request.query;
        const pageNo = query.pageNo || 1;
        const pageSize = query.pageSize || this.app.config.pageSize;
        const team_code = query.team_code;

        const result = await this.ctx.service.application.list(pageNo, pageSize, team_code);

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
        const team_code = query.team_code;
        const _id = query._id;
        if (type === 2 && !_id) throw new Error('id参数不能为空!');
        if (!name) throw new Error('团队名称不能为空!');
        if (!code) throw new Error('团队编码不能为空!');
        if (!team_code) throw new Error('请选择应用所属团队!');

        const result = await this.ctx.service.application.handle({ type, name, code, status, _id, team_code });

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

        const result = await this.ctx.service.application.setStatus({ _id, status });

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

        const result = await this.ctx.service.application.delete(_id);

        ctx.body = this.app.result({
            data: result,
        });
    }


}

module.exports = ApplicationController;
