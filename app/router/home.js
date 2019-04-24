'use strict';
module.exports = app => {
    const { router, controller } = app;
    const { web } = controller;

    // 首页
    router.get('/', web.home);

};
