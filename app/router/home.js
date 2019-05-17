'use strict';
module.exports = app => {
    const { router, controller } = app;
    const { web } = controller;

    // 首页
    router.get('/', web.home);

    // 团队管理
    router.get('/team', web.team);

    // 资产管理
    router.get('/assets', web.assets);

    // 环境管理
    router.get('/environment', web.environment);

    // 应用管理
    router.get('/application', web.application);

    // 应用配置
    router.get('/appconfig', web.appconfig);

    // 邮件管理
    router.get('/emails', web.emails);

    // 应该构建
    router.get('/build', web.build);

    // 开始构建
    router.get('/buildprocess', web.buildprocess);

    // 资产构建
    router.get('/assetsconfig', web.assetsconfig);

    // 资产任务
    router.get('/commtask', web.commtask);

    // 控制台
    router.get('/console', web.console);

    // 构建日志
    router.get('/logs', web.logs);

};
