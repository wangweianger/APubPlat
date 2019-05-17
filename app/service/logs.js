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

    // get list
    async list(pageNo, pageSize, type, name, application_id) {
        pageSize = pageSize * 1;
        pageNo = pageNo * 1;
        type = type * 1;

        const query = { type };
        if (name) query.name = { $regex: new RegExp(name) };
        if (application_id) query.application_id = application_id;

        const count = Promise.resolve(this.ctx.model.Logs.count(query).exec());
        const datas = Promise.resolve(
            this.ctx.model.Logs.find(query)
                .skip((pageNo - 1) * pageSize)
                .limit(pageSize)
                .exec()
        );
        const all = await Promise.all([ count, datas ]);
        const [ totalNum, datalist ] = all;
        return {
            datalist,
            totalNum,
            pageNo,
        };
    }

}

module.exports = LogsService;
