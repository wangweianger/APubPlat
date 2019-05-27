'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

    // 用户登录
    async login() {
        const { ctx } = this;
        const query = ctx.request.body;
        const userName = query.userName;
        const passWord = query.passWord;

        if (!userName) throw new Error('用户登录：userName不能为空');
        if (!passWord) throw new Error('用户登录：passWord不能为空');

        const result = await ctx.service.user.login(userName, passWord);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 用户注册
    async register() {
        const { ctx } = this;
        const query = ctx.request.body;
        const userName = query.userName;
        const passWord = query.passWord;

        if (!userName) throw new Error('用户登录：userName不能为空');
        if (!passWord) throw new Error('用户登录：passWord不能为空');

        const result = await ctx.service.user.register(userName, passWord);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 退出登录
    async logout() {
        const { ctx } = this;
        const usertoken = ctx.cookies.get('usertoken', {
            encrypt: true,
            signed: true,
        }) || '';
        if (!usertoken) throw new Error('退出登录：token不能为空');

        await ctx.service.user.logout(usertoken);
        this.ctx.body = this.app.result({
            data: {},
        });
    }

    // 获得用户列表
    async getUserList() {
        const { ctx } = this;
        const query = ctx.request.query;
        const pageNo = query.pageNo;
        const pageSize = query.pageSize || this.app.config.pageSize;
        const username = query.username;

        const result = await ctx.service.user.getUserList(pageNo, pageSize, username);

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
        const user_name = query.user_name;
        const pass_word = query.pass_word;
        const _id = query._id;

        if ((type === 2 || type === 3) && !_id) throw new Error('id参数不能为空!');
        if (type === 1 && !user_name) throw new Error('用户名称不能为空!');
        if ((type === 1 || type === 3) && !pass_word) throw new Error('密码不能为空!');

        const result = await this.ctx.service.user.handle({ type, user_name, pass_word, status, _id });

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
        const usertoken = query.usertoken || '';
        if (!_id) throw new Error('id参数不能为空!');

        const result = await this.ctx.service.user.setStatus({ _id, status, usertoken });

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 删除用户
    async delete() {
        const { ctx } = this;
        const query = ctx.request.body;
        const id = query.id || '';
        const usertoken = query.usertoken || '';

        if (!id) throw new Error('id不能为空');

        const result = await ctx.service.user.delete(id, usertoken);

        ctx.body = this.app.result({
            data: result,
        });
    }

    async setToken() {
        this.ctx.body = this.app.result({
            data: 'success',
        });
    }
}

module.exports = UserController;
