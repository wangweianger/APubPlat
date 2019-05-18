// 七牛JDK
'use strict';

const Service = require('egg').Service;

class TeamService extends Service {

    // init 初始化
    async list(pageNo, pageSize, status) {
        pageSize = pageSize * 1;
        pageNo = pageNo * 1;
        const query = {};
        if (status) query.status = status * 1;
        const count = Promise.resolve(this.ctx.model.Team.count(query).exec());
        const datas = Promise.resolve(
            this.ctx.model.Team.find(query)
                .skip((pageNo - 1) * pageSize)
                .limit(pageSize)
                .sort({ create_time: -1 })
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

    // 设置状态
    async setStatus(json) {
        const { _id, status } = json;
        return await this.ctx.model.Team.update({ _id }, { $set: { status } }, { multi: true });
    }

    // 删除
    async delete(_id) {
        return await this.ctx.model.Team.remove({ _id });
    }

}

module.exports = TeamService;
