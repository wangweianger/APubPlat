'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        user_name: { type: String }, // 用户名称
        pass_word: { type: String }, // 用户密码
        status: { type: Number, default: 0 }, // 可用装填 1：可用  0：禁用
        token: { type: String }, // 用户秘钥
        usertoken: { type: String }, // 用户登录态秘钥
        create_time: { type: Date, default: Date.now }, // 用户访问时间
    });

    UserSchema.index({ user_name: -1, token: -1 });

    return mongoose.model('User', UserSchema);
};
