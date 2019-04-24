// 七牛JDK
'use strict';

const Service = require('egg').Service;
const { sql } = require('mysqls');

class EmailService extends Service {

    //构建上传策略函数
    async list(key) {
        return  await sql
            .table('email')
            .select(true)
            .order('createTime desc')
            .exec() || [];
    }

    // 新增 | 更新
    async handle(emali, name, id){
        console.log(emali, name, id)
        if (id) id = parseInt(id);
        const opction = { emali, name };

        let result = null;

        if (id + '') {
            // 更新
            result = await sql
                .table('email')
                .data(opction)
                .where({ id: id })
                .update(true)
                .exec();
        } else {
            // 新增
            result = await sql
                .table('email')
                .data(opction)
                .insert(true)
                .exec();
        }

        return result;
    }

    // 删除
    async delete(id){
        return await sql.table('email')
            .where({ id: id })
            .delet(true)
            .exec();
    }

    // 是否禁用
    async usable(id, usable) {
        return await sql
            .table('email')
            .data({ usable})
            .where({ id: id })
            .update(true)
            .exec();
    }

}

module.exports = EmailService;



