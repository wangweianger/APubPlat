'use strict';

module.exports = () => {
    const config = exports = {};

    config.debug = false;

    // 用于安全校验和回调域名根路径 生产线域名（必填）
    config.origin = 'https://test-apub.juxingyi.com';

    config.email = {
        client: {
            // service: '163',
            host: 'smtp.163.com',
            port: 465,
            secure: true,
            auth: {
                user: 'xxxxxx@163.com',
                pass: 'xxxxxx',
            },
        },
    };

    return config;
};
