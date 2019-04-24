'use strict';
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;

class WebController extends Controller {

    async home() {
        const { ctx } = this;
        
        await ctx.render('home', {
            data: {},
        });
    }

}

module.exports = WebController;
