'use strict';
// const fs = require('fs');
// const path = require('path');
const Controller = require('egg').Controller;

class WebController extends Controller {

    async home() {
        const { ctx } = this;

        // this.ctx.service.ssh2.shell();
        // console.log('------------');
        // this.ctx.service.ssh2.exec();
        const result = await this.ctx.service.sftp.list('/data/down');
        console.log(result);

        await ctx.render('home', {
            data: {},
        });
    }

}

module.exports = WebController;
