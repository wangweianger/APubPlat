'use strict';

const Controller = require('egg').Controller;

class CommtaskController extends Controller {

    async list() {
        const { ctx } = this;
        const result = await this.ctx.service.commtask.list();

        ctx.body = this.app.result({
            data: result,
        });
    }

    // add | update
    async handle() {
        const { ctx } = this;
        const query = ctx.request.body;
        const name = query.name;
        const type = query.type || 1;
        const _id = query._id;
        const shell_body = query.shell_body;

        if (parseInt(type) === 2 && !_id) throw new Error('id参数不能为空!');
        if (!name) throw new Error('资产任务名称不能为空!');
        if (!shell_body) throw new Error('资产任务脚本内容不能为空!');

        const result = await this.ctx.service.commtask.handle(query);

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

        const result = await this.ctx.service.commtask.delete(id);

        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = CommtaskController;
