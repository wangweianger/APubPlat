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
        // const result = await this.ctx.service.sftp.get('/data/down/miao.sh');

        await ctx.render('home', {
            data: {},
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

    // 构建配置
    async appconfig() {
        const { ctx } = this;
        await ctx.render('appconfig', {
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

    // 环境配置
    async environment() {
        const { ctx } = this;
        await ctx.render('environment', {
            data: {},
        });
    }

    // 邮件管理
    async emails() {
        const { ctx } = this;
        await ctx.render('email', {
            data: {},
        });
    }

    // 应用构建
    async build() {
        const { ctx } = this;
        await ctx.render('build', {
            data: {},
        });
    }

    // 开始构建
    async buildprocess() {
        const { ctx } = this;
        await ctx.render('buildprocess', {
            data: {},
        });
    }

    // 资产构建
    async assetsconfig() {
        const { ctx } = this;
        await ctx.render('assetsconfig', {
            data: {},
        });
    }

    // 资产任务
    async commtask() {
        const { ctx } = this;
        await ctx.render('commtask', {
            data: {},
        });
    }

    // 控制台
    async console() {
        const { ctx } = this;
        await ctx.render('console', {
            data: {},
        });
    }

}

module.exports = WebController;
