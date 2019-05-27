'use strict';

module.exports = app => {
    const apiV1Router = app.router.namespace('/api/v1/');
    const { controller, io, middleware } = app;
    const {
        files,
        team,
        application,
        assets,
        util,
        environment,
        email,
        build,
        commtask,
        logs,
        user,
    } = controller.api;

    // 校验用户是否登录中间件
    const tokenRequired = middleware.tokenRequired();
    // -----------------用户相关------------------
    // 用户登录
    apiV1Router.post('user/login', user.login);
    // 用户注册
    apiV1Router.post('user/register', user.register);
    // 退出登录
    apiV1Router.get('user/logout', tokenRequired, user.logout);
    // 新增 | 编辑
    apiV1Router.post('user/handle', tokenRequired, user.handle);
    // 获得用户列表
    apiV1Router.get('user/getUserList', tokenRequired, user.getUserList);
    // 冻结解冻用户
    apiV1Router.post('user/setStatus', tokenRequired, user.setStatus);
    // 删除用户
    apiV1Router.post('user/delete', tokenRequired, user.delete);

    // --------------------------- 团队管理 --------------------------------
    // get list
    apiV1Router.get('team/list', tokenRequired, team.list);
    // 新增 | 编辑
    apiV1Router.post('team/handle', tokenRequired, team.handle);
    // 设置状态
    apiV1Router.post('team/setStatus', tokenRequired, team.setStatus);
    // 删除
    apiV1Router.post('team/delete', tokenRequired, team.delete);

    // --------------------------- 环境管理 --------------------------------
    // get list
    apiV1Router.get('environment/list', tokenRequired, environment.list);
    // 新增 | 编辑
    apiV1Router.post('environment/handle', tokenRequired, environment.handle);
    // 删除
    apiV1Router.post('environment/delete', tokenRequired, environment.delete);

    // --------------------------- 应用管理 --------------------------------
    // get list
    apiV1Router.get('application/list', tokenRequired, application.list);
    // get all
    apiV1Router.get('application/all', tokenRequired, application.all);
    // 新增 | 编辑
    apiV1Router.post('application/handle', tokenRequired, application.handle);
    // 设置状态
    apiV1Router.post('application/setStatus', tokenRequired, application.setStatus);
    // 删除
    apiV1Router.post('application/delete', tokenRequired, application.delete);
    // 分配资产
    apiV1Router.post('application/distribution', tokenRequired, application.distribution);
    // 获得单个应用详情
    apiV1Router.get('application/itemdetail', tokenRequired, application.itemdetail);
    // 更新单个应用构建配置
    apiV1Router.post('application/updateConfigs', tokenRequired, application.updateConfigs);
    // 绑定|取消 应用绑定的邮箱
    apiV1Router.post('application/handleEmail', tokenRequired, application.handleEmail);

    // --------------------------- 资产管理 --------------------------------
    // get list
    apiV1Router.get('assets/list', tokenRequired, assets.list);
    // get all
    apiV1Router.get('assets/all', tokenRequired, assets.all);
    // 新增 | 编辑
    apiV1Router.post('assets/handle', tokenRequired, assets.handle);
    // 设置状态
    apiV1Router.post('assets/setStatus', tokenRequired, assets.setStatus);
    // 删除
    apiV1Router.post('assets/delete', tokenRequired, assets.delete);

    // --------------------------- 邮件管理 --------------------------------
    // get list
    apiV1Router.get('email/list', tokenRequired, email.list);
    // 新增 | 编辑
    apiV1Router.post('email/handle', tokenRequired, email.handle);
    // 设置状态
    apiV1Router.post('email/setStatus', tokenRequired, email.setStatus);
    // 删除
    apiV1Router.post('email/delete', tokenRequired, email.delete);

    // -------------------------- 脚本任务管理 ------------------------------
    // get list
    apiV1Router.get('commtask/list', tokenRequired, commtask.list);
    // 新增 | 编辑
    apiV1Router.post('commtask/handle', tokenRequired, commtask.handle);
    // 删除
    apiV1Router.post('commtask/delete', tokenRequired, commtask.delete);

    // --------------------------shh sftp 交互------------------------------
    // update files
    apiV1Router.post('files/updatefile', tokenRequired, files.updatefile);
    // add files
    apiV1Router.post('files/addfile', tokenRequired, files.addfile);

    // --------------------------工具方法------------------------------
    // 获得ssh key
    apiV1Router.post('util/getAssetSshKey', tokenRequired, util.getAssetSshKey);
    // 执行shell任务
    apiV1Router.post('util/handleShellTasks', tokenRequired, util.handleShellTasks);

    // -------------------------- build 构建 ------------------------------
    // 生成构建配置
    apiV1Router.post('build/generateBuildConfig', tokenRequired, build.generateBuildConfig);
    // 备份服务
    apiV1Router.post('build/backupApplications', tokenRequired, build.backupApplications);
    // 构建应用
    apiV1Router.post('build/buildApplicationed', tokenRequired, build.buildApplicationed);
    // 应用还原
    apiV1Router.post('build/reductionApplications', tokenRequired, build.reductionApplications);

    // -------------------------- logs 构建 ------------------------------
    apiV1Router.get('logs/list', tokenRequired, logs.list);

    // -------------------------- socket.io ------------------------------
    // socket.io
    io.of('/').route('socket', io.controller.nsp.socket);
};
