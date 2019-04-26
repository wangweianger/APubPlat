// 七牛JDK
'use strict';

const Service = require('egg').Service;

class TeamService extends Service {

    // init 初始化
    async list(pageNo, pageSize) {
        pageSize = pageSize * 1;
        pageNo = pageNo * 1;
        const query = { status: 1 };
        const count = Promise.resolve(this.ctx.model.Team.count(query).exec());
        const datas = Promise.resolve(
            this.ctx.model.Team.find(query)
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

    // add | update
    async handle(json) {
        const { type, name, code, status, _id } = json;
        let result = '';
        if (type === 1) {
            // add
            const team = this.ctx.model.Team();
            team.name = name;
            team.code = code;
            team.status = status;
            team.create_time = new Date();
            result = await team.save();
        } else if (type === 2) {
            // update
            result = await this.ctx.model.Team.update({ _id }, { $set: { name, code, status } }, { multi: true });
        }
        return result;
    }

}

module.exports = TeamService;
