'use strict';

module.exports = app => {
    const apiV1Router = app.router.namespace('/api/v1/');
    const { controller, middleware } = app;
    const {
        files,
    } = controller.api;

    // 校验用户是否登录中间件
    // const tokenRequired = middleware.tokenRequired();

    // update files
    apiV1Router.post('files/updatefile', files.updatefile);

    // add files
    apiV1Router.post('files/addfile', files.addfile);

};
