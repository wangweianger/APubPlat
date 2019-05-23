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
    ssh2Client(json = {}) {
        const { ctx } = this;
        let { data, taskItem, shell, id, cols, rows } = json;
        data = data || [];
        taskItem = taskItem || {};

        const tasklist = [];
        const date = new Date();
        const { project_path, backups_path, is_backups } = taskItem;
        let backupPath = '';
        let backupDir = '';
        if (taskItem && is_backups && project_path && backups_path) {
            backupDir = 'bak_' + this.app.format(new Date(), 'yyyy-MM-dd:hh:mm:ss');
            const projectName = project_path ? project_path.split('/').splice(-1).join() : '';
            backupPath = `${backups_path}/${backupDir}/${projectName}`;
        }

        for (let i = 0; i < data.length; i++) {
            const datas = data[i] || {};
            const assitsItem = datas.assitsItem || {};
            const item = Promise.resolve(
                this.backUpProject(taskItem, assitsItem, backupPath, backupDir).then(data => {
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
                        cols: cols || 138,
                        rows: rows || 46,
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
        const { data, cols, rows } = query;
        this.ssh2Client({ data, cols, rows });
    }

    // 应用构建
    async buildProcess(query = {}) {
        if (!query.data) return;
        const { taskItem, data, id } = query;

        let shell = '';
        if (taskItem && taskItem.shell_path) {
            shell = taskItem.shell_path ?
                `sh ${taskItem.shell_path} ${taskItem.shell_opction || ''} \n` :
                taskItem.shell_body + '\n';
        }

        const result = await this.ssh2Client({ data, taskItem, shell, id });
        // 保存备份日志
        taskItem.is_backups && this.ctx.service.logs.addLogs({
            name: `${taskItem.task_name}任务-服务备份`,
            type: 2,
            application_id: id,
            content: result || [],
        });
    }

    // 备份
    backUpProject(taskItem = {}, assitsItem = {}, backupPath, backupDir) {
        const { is_backups, project_path, backups_path } = taskItem;
        let promise = null;
        if (taskItem && is_backups && project_path && backups_path) {
            promise = this.ctx.service.build.backUpProject(taskItem, assitsItem, backupPath, backupDir);
        } else {
            promise = new Promise(resolve => { resolve(1); });
        }
        return promise;
    }

}

module.exports = NspController;
