// 七牛JDK
'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');

class CommtaskService extends Service {

    // init 初始化
    async list() {
        return await this.ctx.model.Commtask
            .find()
            .sort({ create_time: -1 })
            .exec() || [];
    }

    // add | update
    async handle(query) {
        let { _id, name, type, btn_color, is_plain, shell_body, handletype, shell_opction, shell_path, shell_write_type, user_name } = query;
        handletype = handletype * 1;
        let result = '';
        if (handletype === 1) {
            // add
            const commtask = this.ctx.model.Commtask();
            commtask.name = name;
            commtask.type = type;
            commtask.btn_color = btn_color;
            commtask.is_plain = is_plain;
            commtask.user_name = user_name;
            commtask.shell_body = shell_body;
            commtask.shell_opction = shell_opction;
            commtask.shell_path = shell_path;
            commtask.shell_write_type = shell_write_type || 1;
            commtask.create_time = new Date();
            result = await commtask.save();
        } else if (handletype === 2) {
            // update
            result = await this.ctx.model.Commtask.update(
                { _id },
                { $set: { name, type, btn_color, is_plain, shell_body, shell_opction, shell_path, shell_write_type, user_name } },
                { multi: true }
            );
        }
        return result;
    }

    // 删除
    async delete(id) {
        return await this.ctx.model.Commtask.remove({ _id: id });
    }

    // init 初始化
    async generateBuildConfig(id, item, assetslist = []) {
        let file = '';
        let paths = '/';
        if (item.shell_path && item.shell_path.indexOf('/') > -1) {
            file = path.basename(item.shell_path);
            paths = path.dirname(item.shell_path);
        } else {
            throw new Error('shell脚本地址必须以/开头!');
        }
        // 本地创建文件
        fs.writeFileSync(path.resolve(__dirname, '../tempFile/' + file), item.shell_body);
        const result = [];
        for (let i = 0; i < assetslist.length; i++) {
            result.push(this.service.util.genConfigsForSsh({
                paths,
                file,
                host: assetslist[i].outer_ip,
                port: assetslist[i].port,
                username: assetslist[i].user,
                password: assetslist[i].password,
                shell_path: item.shell_path,
            }));
        }
        await Promise.all(result);
        // 删除
        fs.unlinkSync(path.resolve(__dirname, '../tempFile/' + file));
        return {};
    }

}

module.exports = CommtaskService;
