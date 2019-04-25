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
        const result = await this.ctx.service.sftp.get('/data/down/app.sh');
        console.log(result.toString());

        await ctx.render('home', {
            data: {},
        });
    }

}

module.exports = WebController;
