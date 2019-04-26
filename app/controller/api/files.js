'use strict';

const Controller = require('egg').Controller;

class FilesController extends Controller {

    // update file
    async updatefile() {
        const { ctx } = this;
        const query = ctx.request.body;
        const content = query.content;
        const filename = query.filename;
        if (!filename) throw new Error('需要修改的文件不能为空!');
        if (!content) throw new Error('修改文件的内容不能为空!');

        const result = await this.ctx.service.files.updatefile(filename, content) || {};

        ctx.body = this.app.result({
            data: result,
        });
    }

    // add file
    async addfile() {
        const { ctx } = this;
        const query = ctx.request.body;
        const filename = query.filename.trim();
        const content = query.content;
        const remotePath = query.remotePath;
        if (!filename) throw new Error('文件名称不能为空!');
        if (!content) throw new Error('新增文件的内容不能为空!');
        if (!remotePath) throw new Error('新增文件的远程目录不能为空!');

        const result = await this.ctx.service.files.addfile(filename, content, remotePath) || {};

        ctx.body = this.app.result({
            data: result,
        });
    }

}

module.exports = FilesController;
