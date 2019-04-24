'use strict';

const Controller = require('egg').Controller;

class EmailController extends Controller {

    async list() {
        const { ctx } = this;
        const result = await ctx.service.email.list();
        ctx.body = this.app.result({
            data: result,
        });
    }

    // 新增 | 更新
    async handle(){
        const { ctx } = this;
        const query = ctx.request.body || {};
        const id = query.id || '';
        const emali = query.emali;
        const name = query.name;

        if (!emali) throw new Error('邮箱号码不能为空');
        if (!name) throw new Error('邮箱所属用户不能为空');

        const result = await ctx.service.email.handle(emali, name, id);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 删除
    async delete(){
        const { ctx } = this;
        const query = ctx.request.body || {};
        const id = query.id;

        if (!id) throw new Error('id不能为空！');

        const result = await ctx.service.email.delete(id);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 是否启用
    async usable() {
        const { ctx } = this;
        const query = ctx.request.body || {};
        const id = query.id;
        const usable = query.usable;

        if (!id) throw new Error('id不能为空！');
        if (!usable) throw new Error('是否禁用参数不能为空！');

        const result = await ctx.service.email.usable(id, usable);

        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = EmailController;
