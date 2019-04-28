'use strict';

module.exports = app => {
    const apiV1Router = app.router.namespace('/api/v1/');
    const { controller, middleware } = app;
    const {
        files,
        team,
        application,
        assets,
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

    // --------------------------- 应用管理 --------------------------------
    // get list
    apiV1Router.get('application/list', application.list);
    // 新增 | 编辑
    apiV1Router.post('application/handle', application.handle);
    // 设置状态
    apiV1Router.post('application/setStatus', application.setStatus);
    // 删除
    apiV1Router.post('application/delete', application.delete);

    // --------------------------- 资产管理 --------------------------------
    // get list
    apiV1Router.get('assets/list', assets.list);
    // 新增 | 编辑
    apiV1Router.post('assets/handle', assets.handle);
    // 设置状态
    apiV1Router.post('assets/setStatus', assets.setStatus);
    // 删除
    apiV1Router.post('assets/delete', assets.delete);

    // --------------------------shh sftp 交互------------------------------
    // update files
    apiV1Router.post('files/updatefile', files.updatefile);
    // add files
    apiV1Router.post('files/addfile', files.addfile);

};
