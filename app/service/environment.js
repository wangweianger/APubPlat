// 七牛JDK
'use strict';

const Service = require('egg').Service;

class EnvironmentService extends Service {

    // init 初始化
    async list(pageNo, pageSize) {
        pageSize = pageSize * 1;
        pageNo = pageNo * 1;
        const count = Promise.resolve(this.ctx.model.Environment.count().exec());
        const datas = Promise.resolve(
            this.ctx.model.Environment.find()
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
        const { type, name, code, id } = json;
        let result = '';
        if (type === 1) {
            // add
            const environment = this.ctx.model.Environment();
            environment.name = name;
            environment.code = code;
            environment.create_time = new Date();
            result = await environment.save();
        } else if (type === 2) {
            // update
            result = await this.ctx.model.Environment.update({ _id: id }, { $set: { name, code } }, { multi: true });
        }
        return result;
    }

    // 删除
    async delete(id) {
        return await this.ctx.model.Environment.remove({ _id: id });
    }

}

module.exports = EnvironmentService;
