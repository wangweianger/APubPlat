'use strict';
module.exports = app => {
    const { router, controller } = app;
    const { web } = controller;

    // 首页
    router.get('/', web.home);

    // 团队管理
    router.get('/team', web.team);

    // 应用管理
    router.get('/application', web.application);

    // 资产管理
    router.get('/assets', web.assets);

};
