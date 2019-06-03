'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const LogsSchema = new Schema({
        name: { type: String }, // 日志名称
        user_name: { type: String }, // 操作人
        application_id: { type: String }, // 所属应用code
        commtask_id: { type: String }, // 所属脚本任务code
        type: { type: Number, default: 1 }, // 日志类型 1：发布服务  2：应用服务备份  3：应用生成构建配置 4：服务资产生成构建配置 5:备份还原记录
        delete: { type: Boolean, default: false }, // 是否删除过
        content: { type: Object }, // 日志item内容项目
        create_time: { type: Date, default: Date.now }, // 创建时间
    });

    return mongoose.model('Logs', LogsSchema);
};
