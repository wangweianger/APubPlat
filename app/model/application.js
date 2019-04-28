'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ApplicationSchema = new Schema({
        name: { type: String }, // 应用名称
        code: { type: String }, // 应用编码
        team_code: { type: String }, // 所属公司编码
        assets_list: { type: Array }, // 拥有资产列表
        status: { type: Number, default: 1 }, // 可用装填 1：可用  0：禁用
        create_time: { type: Date, default: Date.now }, // 创建时间
    });

    return mongoose.model('Application', ApplicationSchema);
};
