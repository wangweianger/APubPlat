'use strict';

const Controller = require('egg').Controller;

class BuildController extends Controller {

    // 生成构建配置
    async generateBuildConfig() {
        const { ctx } = this;
        const query = ctx.request.body;
        const id = query.id || '';
        const taskItem = query.taskItem || {};
        const assetsList = query.assetsList || [];
        const user_name = query.user_name || '';

        if (!taskItem.shell_path) throw new Error('shell脚本地址不能为空!');
        if (!taskItem.shell_body) throw new Error('shell脚本内容不能为空!');

        const result = await this.ctx.service.build.generateBuildConfig(id, taskItem, assetsList, user_name);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 服务备份
    async backupApplications() {
        const { ctx } = this;
        const query = ctx.request.body;
        const taskItem = query.taskItem || {};
        const assetsList = query.assetsList || [];
        const id = query.id || '';
        const user_name = query.user_name || '';

        if (!taskItem.project_path) throw new Error('应用所在位置不能为空!');
        if (!taskItem.backups_path) throw new Error('应用备份的路径不能为空!');

        const result = await this.ctx.service.build.backupApplications(id, taskItem, assetsList, user_name);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 构建应用
    async buildApplicationed() {
        const { ctx } = this;
        const query = ctx.request.body;
        const result = await this.ctx.service.logs.addLogs(query);

        ctx.body = this.app.result({
            data: result,
        });
    }

    // 应用还原
    async reductionApplications() {
        const { ctx } = this;
        const query = ctx.request.body;
        const taskItem = query.taskItem || {};
        const assetsList = query.assetsList || [];
        const id = query.id || '';
        const user_name = query.user_name || '';

        if (!taskItem.reduction_shell_path) throw new Error('备份shell脚本路径不能为空!');
        if (!taskItem.reduction_shell_body) throw new Error('备份shell脚本内容不能为空!');

        const result = await this.ctx.service.build.reductionApplications(id, taskItem, assetsList, user_name);

        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = BuildController;
