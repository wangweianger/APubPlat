'use strict';

const Controller = require('egg').Controller;

class QiniuController extends Controller {

    async getToken() {
        const { ctx } = this;
        const result = await ctx.service.qiniu.getToken();
        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = QiniuController;
