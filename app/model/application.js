'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ApplicationSchema = new Schema({
        name: { type: String }, // 应用名称
        code: { type: String }, // 应用编码
        team_code: { type: String }, // 所属公司编码
        assets_list: { type: Array }, // 拥有资产列表
        config_type: { type: Number, default: 1 }, // 1: git hooks  2: shell 脚本
        git_msg: { type: Object }, // git 相关信息  git_type： 1:https 2:ssh   git_url：git地址 git_user git_pwd
        shell_path: { type: String }, // 编译shell脚本的路径
        shell_body: { type: String }, // 编译shell脚本的内容
        status: { type: Number, default: 1 }, // 可用装填 1：可用  0：禁用
        create_time: { type: Date, default: Date.now }, // 创建时间
    });

    return mongoose.model('Application', ApplicationSchema);
};
