// 七牛JDK
'use strict';

const Service = require('egg').Service;

class ApplicationService extends Service {

    // init 初始化
    async list(pageNo, pageSize, team_code) {
        pageSize = pageSize * 1;
        pageNo = pageNo * 1;
        const query = { $match: {} };
        if (team_code) query.$match.team_code = team_code;
        const count = Promise.resolve(this.ctx.model.Application.count(query.$match).exec());
        const datas = Promise.resolve(
            this.ctx.model.Application.aggregate([
                query,
                {
                    $lookup: {
                        from: 'teams',
                        localField: 'team_code',
                        foreignField: 'code',
                        as: 'teamlist',
                    },
                },
                { $skip: (pageNo - 1) * pageSize },
                { $sort: { count: -1 } },
                { $limit: pageSize },
            ]).exec()
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
        const { type, name, code, status, _id, team_code } = json;
        let result = '';
        if (type === 1) {
            // add
            const application = this.ctx.model.Application();
            application.name = name;
            application.code = code;
            application.status = status;
            application.team_code = team_code;
            application.create_time = new Date();
            result = await application.save();
        } else if (type === 2) {
            // update
            result = await this.ctx.model.Application.update({ _id }, { $set: { name, code, status, team_code } }, { multi: true });
        }
        return result;
    }

    // 设置状态
    async setStatus(json) {
        const { _id, status } = json;
        return await this.ctx.model.Application.update({ _id }, { $set: { status } }, { multi: true });
    }

    // 删除
    async delete(_id) {
        return await this.ctx.model.Application.remove({ _id });
    }

    // 分配资产
    async distribution(_id, assets_list = []) {
        return await this.ctx.model.Application.update({ _id }, { $set: { assets_list } }, { multi: true });
    }

    // 单个应用详情
    async itemdetail(id) {
        return await this.ctx.model.Application.findOne({ _id: id, status: 1 });
    }

}

module.exports = ApplicationService;
