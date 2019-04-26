'use strict';
// const fs = require('fs');
// const path = require('path');
const Controller = require('egg').Controller;

class WebController extends Controller {

    async home() {
        const { ctx } = this;

        // this.ctx.service.ssh2.shell();
        // this.ctx.service.ssh2.exec('bash /data/down/app.sh');
        // const result = await this.ctx.service.sftp.list('/data/down');
        // console.log(result);
        const result = await this.ctx.service.sftp.get('/data/down/miao.sh');

        await ctx.render('home', {
            data: {
                result: result.toString(),
            },
        });
    }

    // 团队管理
    async team() {
        const { ctx } = this;
        await ctx.render('team', {
            data: {},
        });
    }

    // 应用管理
    async application() {
        const { ctx } = this;
        await ctx.render('application', {
            data: {},
        });
    }

    // 应用管理
    async assets() {
        const { ctx } = this;
        await ctx.render('assets', {
            data: {},
        });
    }

}

module.exports = WebController;
