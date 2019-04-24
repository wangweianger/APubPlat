'use strict';

module.exports = app => {
    const apiV1Router = app.router.namespace('/api/v1/');
    const { controller, middleware } = app;
    const {
        user,
        banner,
        qiniu,
        customer,
        email,
        news,
        newsbanner,
    } = controller.api;

    // 校验用户是否登录中间件
    const tokenRequired = middleware.tokenRequired();

    // -----------------用户相关------------------
    // set token
    // apiV1Router.get('set/token', user.setToken);

};
