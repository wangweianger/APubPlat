'use strict';

module.exports = () => {
    const config = exports = {};

    config.debug = false;

    // 用于安全校验和回调域名根路径 生产线域名（必填）
    config.origin = 'https://pc.juxingyi.com';

    config.mysql = {
        run: true,
        host: '10.1.0.121',
        user: 'root',
        password: 'rNg0IZc2V2oF',
        database: 'cluster_star',
        port: 3306,
    }

    return config;
};
