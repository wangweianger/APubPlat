'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

    async login() {
        const { ctx } = this;
        const query = ctx.request.body;
        const userName = query.username;
        const passWord = query.password;
        if (!userName) throw new Error('用户登录：userName不能为空');
        if (!passWord) throw new Error('用户登录：passWord不能为空');

        const result = await ctx.service.user.login(userName, passWord);

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

    async setToken(){
        this.ctx.body = this.app.result({
            data: 'success',
        }); 
    }
}

module.exports = UserController;
