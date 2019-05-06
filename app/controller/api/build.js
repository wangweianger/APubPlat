'use strict';

const Controller = require('egg').Controller;

class BuildController extends Controller {

    async generateBuildConfig() {
        const { ctx } = this;
        const query = ctx.request.body;
        const id = query.id;
        const item = query.item || {};
        const assetslist = query.assetslist || [];

        const result = await this.ctx.service.build.generateBuildConfig(id, item, assetslist);

        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = BuildController;
