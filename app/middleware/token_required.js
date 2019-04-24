'use strict';
const { URL } = require('url');

// 校验用户是否登录
module.exports = () => {
    return async function (ctx, next) {
        const usertoken = ctx.cookies.get('usertoken', {
            encrypt: true,
            signed: true,
        }) || '';
        if (!usertoken) {
            ctx.body = {
                code: 1004,
                desc: '用户未登录',
            };
            return;
        }
        await next();
    };
};
