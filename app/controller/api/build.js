'use strict';

const Controller = require('egg').Controller;

class BuildController extends Controller {

    // 生成构建配置
    async generateBuildConfig() {
        const { ctx } = this;
        const query = ctx.request.body;
        const id = query.id;
        const taskItem = query.taskItem || {};
        const assetsList = query.assetsList || [];

        if (!taskItem.shell_path) throw new Error('shell脚本地址不能为空!');
        if (!taskItem.shell_body) throw new Error('shell脚本内容不能为空!');

        const result = await this.ctx.service.build.generateBuildConfig(id, taskItem, assetsList);

        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = BuildController;
