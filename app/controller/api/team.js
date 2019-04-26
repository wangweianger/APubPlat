'use strict';

const Controller = require('egg').Controller;

class TeamController extends Controller {

    async list() {
        const { ctx } = this;
        const query = ctx.request.query;
        const pageNo = query.pageNo || 1;
        const pageSize = query.pageSize || this.app.config.pageSize;

        const result = await this.ctx.service.team.list(pageNo, pageSize);

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
        if (type === 2 && !_id) throw new Error('id参数不能为空!');
        if (!name) throw new Error('团队名称不能为空!');
        if (!code) throw new Error('团队编码不能为空!');

        const result = await this.ctx.service.team.handle({ type, name, code, status, _id });

        ctx.body = this.app.result({
            data: result,
        });
    }


}

module.exports = TeamController;
