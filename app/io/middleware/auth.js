'use strict';

module.exports = () => {
    return async (ctx, next) => {
        // ctx.socket.emit('response', 'connected!');
        await next();
    };
};
