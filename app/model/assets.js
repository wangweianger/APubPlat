'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AssetsSchema = new Schema({
        name: { type: String }, // 资产名称
        code: { type: String }, // 资产编码
        outer_ip: { type: String }, // 外网IP
        lan_ip: { type: String }, // 内网IP
        user: { type: String }, // 登录用户
        port: { type: Number }, // 登录端口号
        password: { type: String }, // 登录密码
        team_code: { type: String }, // 所属团队编码
        status: { type: Number, default: 1 }, // 可用装填 1：可用  0：禁用
        create_time: { type: Date, default: Date.now }, // 创建时间
    });

    return mongoose.model('Assets', AssetsSchema);
};
