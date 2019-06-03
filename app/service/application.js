// 七牛JDK
'use strict';

const Service = require('egg').Service;

class ApplicationService extends Service {

    // init 初始化
    async list(pageNo, pageSize, team_code, environ_code, net_type, status, name) {
        pageSize = pageSize * 1;
        pageNo = pageNo * 1;
        const query = { $match: {} };
        if (team_code) query.$match.team_code = team_code;
        if (environ_code) query.$match.environ_code = environ_code;
        if (net_type) query.$match.net_type = net_type * 1;
        if (status + '') query.$match.status = status * 1;
        if (name) query.$match.name = { $regex: new RegExp(name) };

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
                {
                    $lookup: {
                        from: 'environments',
                        localField: 'environ_code',
                        foreignField: 'code',
                        as: 'environlist',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        teamlist: 1,
                        assets_list: 1,
                        email_list: 1,
                        net_type: 1,
                        status: 1,
                        environlist: 1,
                        team_code: 1,
                        environ_code: 1,
                        user_name: 1,
                        code: 1,
                        task_list: 1,
                    },
                },
                { $skip: (pageNo - 1) * pageSize },
                { $sort: { create_time: -1 } },
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

    async all() {
        return this.ctx.model.Application.aggregate([
            { $match: { status: 1 } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    assets_list: 1,
                },
            },
            { $sort: { count: -1 } },
        ]).exec();
    }

    // add | update
    async handle(json) {
        const { type, name, code, status, _id, team_code, environ_code, user_name } = json;
        let result = '';
        if (type === 1) {
            // add
            const application = this.ctx.model.Application();
            application.name = name;
            application.code = code;
            application.status = status;
            application.team_code = team_code;
            application.user_name = user_name;
            application.environ_code = environ_code;
            application.create_time = new Date();
            result = await application.save();
        } else if (type === 2) {
            // update
            result = await this.ctx.model.Application.update({ _id }, { $set: { name, code, status, team_code, environ_code, user_name } }, { multi: true });
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
    async distribution(_id, assets_list = [], net_type) {
        net_type = net_type * 1;
        return await this.ctx.model.Application.update({ _id }, { $set: { assets_list, net_type } }, { multi: true });
    }

    // 单个应用详情
    async itemdetail(id) {
        return await this.ctx.model.Application.findOne({ _id: id, status: 1 });
    }
    // 更新单个应用部署配置
    async updateConfigs(id, tasklist) {
        return await this.ctx.model.Application.update(
            { _id: id },
            { $set: { task_list: tasklist } },
            { multi: true }
        );
    }

    // 绑定|取消 应该绑定的邮箱
    async handleEmail(id, emaillist) {
        return await this.ctx.model.Application.update(
            { _id: id },
            { $set: { email_list: emaillist } },
            { multi: true }
        );
    }

}

module.exports = ApplicationService;
