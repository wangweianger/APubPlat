'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {

    async socket() {
        const { ctx } = this;
        const message = ctx.args[0];
        console.log('------------');
        console.log(message);
        await ctx.socket.emit('response', "Hi! I've got your message");
    }
}

module.exports = NspController;
