'use strict';

module.exports = app => {
    const apiV1Router = app.router.namespace('/api/v1/');
    const { controller, middleware } = app;
    const {
        home,
    } = controller.api;

    // 校验用户是否登录中间件
    // const tokenRequired = middleware.tokenRequired();

    // -----------------用户相关------------------
    // set token
    apiV1Router.post('home/set', home.set);

};
