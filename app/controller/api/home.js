'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

    async set() {
        const { ctx } = this;
        const query = ctx.request.body;
        let text = query.text;
        text = text.replace(/;/g, '\;');
        text = text.replace(/"/g, '\'');
        // if (!userName) throw new Error('用户登录：userName不能为空');

        await this.ctx.service.ssh2.exec(`echo -e "${text}" > /data/down/app.sh`);

        ctx.body = this.app.result({
            data: {},
        });
    }

}

module.exports = HomeController;
