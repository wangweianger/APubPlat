'use strict';

const Controller = require('egg').Controller;
const socket = require('../../util/socket');

class NspController extends Controller {

    async socket() {
        const { ctx } = this;
        const query = ctx.args[0];

        const buildType = query.buildType;
        switch (buildType) {
        case 'buildprocess': case 'buildtasks':
            this.buildProcess(query);
            break;
        case 'sshonline':
            this.sshOnline(query);
            break;
        default:
        }
    }

    // common ssh2 servers
    ssh2Client(data = [], taskItem = {}, shell = '', id = '') {
        const { ctx } = this;
        const tasklist = [];
        const date = new Date();
        for (let i = 0; i < data.length; i++) {
            const datas = data[i] || {};
            const assitsItem = datas.assitsItem || {};
            const item = Promise.resolve(
                this.backUpProject(taskItem, assitsItem).then(data => {
                    socket({
                        id,
                        date,
                        taskName: taskItem.task_name ? `${taskItem.task_name}任务-构建应用服务` : '',
                        assetsName: assitsItem.name,
                        lanip: assitsItem.lan_ip,
                        host: assitsItem.outer_ip,
                        port: assitsItem.port,
                        username: assitsItem.user,
                        password: assitsItem.password,
                        cols: 138,
                        rows: 46,
                        term: 'xterm-color',
                        socket: {
                            socket: ctx.socket,
                            geometry: datas.geometry,
                            close: datas.close,
                            data: datas.data,
                            end: datas.end,
                            resize: datas.resize,
                        },
                        initialTask: shell,
                    });
                    return data;
                })
            );
            tasklist.push(item);
        }
        return Promise.all(tasklist);
    }

    // 构建task
    async sshOnline(query = {}) {
        if (!query.data) return;
        const { data } = query;
        this.ssh2Client(data);
    }

    // 应用构建
    async buildProcess(query = {}) {
        if (!query.data) return;
        const { taskItem, data, id } = query;

        let shell = '';
        if (taskItem && taskItem.shell_path) {
            shell = taskItem.shell_path ?
                `sh ${taskItem.shell_path} ${taskItem.shell_opction || ''} \r\n` :
                taskItem.shell_body + '\r\n';
        }

        const result = await this.ssh2Client(data, taskItem, shell, id);
        // 保存备份日志
        taskItem.is_backups && this.ctx.service.logs.addLogs({
            name: `${taskItem.task_name}任务-服务备份`,
            type: 2,
            application_id: id,
            content: result || [],
        });
    }

    // 备份
    backUpProject(taskItem = {}, assitsItem = {}) {
        const { is_backups, project_path, backups_path } = taskItem;
        let promise = null;
        if (taskItem && is_backups && project_path && backups_path) {
            promise = this.ctx.service.build.backUpProject(taskItem, assitsItem || {});
        } else {
            promise = new Promise(resolve => { resolve(1); });
        }
        return promise;
    }

}

module.exports = NspController;
