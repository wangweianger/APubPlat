// 七牛JDK
'use strict';

const Service = require('egg').Service;

class LogsService extends Service {

    // add logs
    async addLogs(json = {}) {
        const { task_name, application_id, commtask_id, type, content, date } = json;
        const logs = this.ctx.model.Logs();
        logs.name = task_name || '';
        logs.type = type || '';
        logs.content = content || '';
        logs.application_id = application_id || '';
        logs.commtask_id = commtask_id || '';
        logs.create_time = date ? new Date(date) : new Date();
        return await logs.save();
    }

}

module.exports = LogsService;
