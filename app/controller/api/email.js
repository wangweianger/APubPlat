'use strict';

const Controller = require('egg').Controller;

class EmailController extends Controller {

    async list() {
        const { ctx } = this;
        const query = ctx.request.query;
        const pageNo = query.pageNo || 1;
        const pageSize = query.pageSize || this.app.config.pageSize;
        const status = query.status;

        const result = await this.ctx.service.email.list(pageNo, pageSize, status);

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
        const email = query.email;
        const id = query.id;
        if (type === 2 && !id) throw new Error('id参数不能为空!');
        if (!email) throw new Error('邮件地址不能为空!');
        if (!name) throw new Error('邮件所属人不能为空!');

        const result = await this.ctx.service.email.handle({ type, name, email, status, id });

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 禁用 | 启用
    async setStatus() {
        const { ctx } = this;
        const query = ctx.request.body;
        const id = query.id;
        const status = query.status || 1;
        if (!id) throw new Error('id参数不能为空!');

        const result = await this.ctx.service.email.setStatus({ id, status });

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

        const result = await this.ctx.service.email.delete(id);

        ctx.body = this.app.result({
            data: result,
        });
    }


}

module.exports = EmailController;
