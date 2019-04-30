'use strict';

const Controller = require('egg').Controller;

class TeamController extends Controller {

    async list() {
        const { ctx } = this;
        const query = ctx.request.query;
        const pageNo = query.pageNo || 1;
        const pageSize = query.pageSize || this.app.config.pageSize;

        const result = await this.ctx.service.environment.list(pageNo, pageSize);

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
        const name = query.name;
        const code = query.code;
        const id = query.id;
        if (type === 2 && !id) throw new Error('id参数不能为空!');
        if (!name) throw new Error('环境名称不能为空!');
        if (!code) throw new Error('环境编码不能为空!');

        const result = await this.ctx.service.environment.handle({ type, name, code, id });

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 删除
    async delete() {
        const { ctx } = this;
        const query = ctx.request.body;
        const id = query.id;
        if (!id) throw new Error('id参数不能为空!');

        const result = await this.ctx.service.environment.delete(id);

        ctx.body = this.app.result({
            data: result,
        });
    }


}

module.exports = TeamController;
