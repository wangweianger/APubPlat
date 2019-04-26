'use strict';

module.exports = app => {
    const apiV1Router = app.router.namespace('/api/v1/');
    const { controller, middleware } = app;
    const {
        files,
        team,
    } = controller.api;

    // 校验用户是否登录中间件
    // const tokenRequired = middleware.tokenRequired();

    // --------------------------- 团队管理 --------------------------------
    // get list
    apiV1Router.get('team/list', team.list);
    // 新增 | 编辑
    apiV1Router.post('team/handle', team.handle);

    // --------------------------shh sftp 交互------------------------------
    // update files
    apiV1Router.post('files/updatefile', files.updatefile);
    // add files
    apiV1Router.post('files/addfile', files.addfile);

};
