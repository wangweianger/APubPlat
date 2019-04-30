'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const EnvironmentSchema = new Schema({
        name: { type: String }, // 团队名称
        code: { type: String }, // 团队编码
        create_time: { type: Date, default: Date.now }, // 创建时间
    });

    return mongoose.model('Environment', EnvironmentSchema);
};
