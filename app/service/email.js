// 七牛JDK
'use strict';

const Service = require('egg').Service;

class EmailService extends Service {

    // init 初始化
    async list(pageNo, pageSize, status) {
        pageSize = pageSize * 1;
        pageNo = pageNo * 1;
        const query = {};
        if (status) query.status = status * 1;
        const count = Promise.resolve(this.ctx.model.Email.count(query).exec());
        const datas = Promise.resolve(
            this.ctx.model.Email.find(query)
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
        const { type, name, email, status, id } = json;
        let result = '';
        if (type === 1) {
            // add
            const emails = this.ctx.model.Email();
            emails.name = name;
            emails.email = email;
            emails.status = status;
            emails.create_time = new Date();
            result = await emails.save();
        } else if (type === 2) {
            // update
            result = await this.ctx.model.Email.update({ _id: id }, { $set: { name, email, status } }, { multi: true });
        }
        return result;
    }

    // 设置状态
    async setStatus(json) {
        const { id, status } = json;
        return await this.ctx.model.Email.update({ _id: id }, { $set: { status } }, { multi: true });
    }

    // 删除
    async delete(id) {
        return await this.ctx.model.Email.remove({ _id: id });
    }

}

module.exports = EmailService;
