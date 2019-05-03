'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const TeamSchema = new Schema({
        email: { type: String }, // 邮件地址
        name: { type: String }, // 邮件所属人员
        status: { type: Number, default: 1 }, // 可用装填 1：可用  0：禁用
        create_time: { type: Date, default: Date.now }, // 创建时间
    });

    return mongoose.model('Email', TeamSchema);
};
