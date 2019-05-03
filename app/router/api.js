'use strict';

module.exports = app => {
    const apiV1Router = app.router.namespace('/api/v1/');
    const { controller, middleware } = app;
    const {
        files,
        team,
        application,
        assets,
        util,
        environment,
        email,
    } = controller.api;

    // 校验用户是否登录中间件
    // const tokenRequired = middleware.tokenRequired();

    // --------------------------- 团队管理 --------------------------------
    // get list
    apiV1Router.get('team/list', team.list);
    // 新增 | 编辑
    apiV1Router.post('team/handle', team.handle);
    // 设置状态
    apiV1Router.post('team/setStatus', team.setStatus);
    // 删除
    apiV1Router.post('team/delete', team.delete);

    // --------------------------- 环境管理 --------------------------------
    // get list
    apiV1Router.get('environment/list', environment.list);
    // 新增 | 编辑
    apiV1Router.post('environment/handle', environment.handle);
    // 删除
    apiV1Router.post('environment/delete', environment.delete);

    // --------------------------- 应用管理 --------------------------------
    // get list
    apiV1Router.get('application/list', application.list);
    // 新增 | 编辑
    apiV1Router.post('application/handle', application.handle);
    // 设置状态
    apiV1Router.post('application/setStatus', application.setStatus);
    // 删除
    apiV1Router.post('application/delete', application.delete);
    // 分配资产
    apiV1Router.post('application/distribution', application.distribution);
    // 获得单个应用详情
    apiV1Router.get('application/itemdetail', application.itemdetail);
    // 更新单个应用构建配置
    apiV1Router.post('application/updateConfigs', application.updateConfigs);

    // --------------------------- 资产管理 --------------------------------
    // get list
    apiV1Router.get('assets/list', assets.list);
    // 新增 | 编辑
    apiV1Router.post('assets/handle', assets.handle);
    // 设置状态
    apiV1Router.post('assets/setStatus', assets.setStatus);
    // 删除
    apiV1Router.post('assets/delete', assets.delete);

    // --------------------------- 邮件管理 --------------------------------
    // get list
    apiV1Router.get('email/list', email.list);
    // 新增 | 编辑
    apiV1Router.post('email/handle', email.handle);
    // 设置状态
    apiV1Router.post('email/setStatus', email.setStatus);
    // 删除
    apiV1Router.post('email/delete', email.delete);

    // --------------------------shh sftp 交互------------------------------
    // update files
    apiV1Router.post('files/updatefile', files.updatefile);
    // add files
    apiV1Router.post('files/addfile', files.addfile);

    // --------------------------工具方法------------------------------
    // 检测服务器是否安装GIT环境
    apiV1Router.post('util/checkGitEnviron', util.checkGitEnviron);
    // 服务器是安装GIT环境
    apiV1Router.post('util/installGitEnviron', util.installGitEnviron);

};
