// 七牛JDK
'use strict';

const Service = require('egg').Service;

class LogsService extends Service {

    // add logs
    async addLogs(json = {}) {
        const { name, application_code, commtask_code, type, content } = json;
        const logs = this.ctx.model.Logs();
        logs.name = name || '';
        logs.type = type || '';
        logs.content = content || '';
        logs.application_code = application_code || '';
        logs.commtask_code = commtask_code || '';
        logs.create_time = new Date();
        return await logs.save();
    }

}

module.exports = LogsService;
