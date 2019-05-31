'use strict';

module.exports = () => {
    const config = exports = {};

    config.debug = false;

    // 用于安全校验和回调域名根路径 生产线域名（必填）
    config.origin = 'https://xxx.xxx.com';

    return config;
};
