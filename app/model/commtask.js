'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const CommtaskSchema = new Schema({
        name: { type: String }, // 任务名称
        type: { type: Number, default: 1 }, // 任务类型 1：窗口运行命令  2：shell脚本命令
        shell_body: { type: String }, // 运行内容
        shell_opction: { type: String }, // shell 参数
        shell_path: { type: String }, // shell存放路径
        btn_color: { type: String, default: 'primary' }, // 按钮颜色 可选类型 ：primary|success|info|warning|danger|default
        is_plain: { type: Number, default: 2 }, // 是:1 否：2
        create_time: { type: Date, default: Date.now }, // 创建时间
    });

    return mongoose.model('Commtask', CommtaskSchema);
};
