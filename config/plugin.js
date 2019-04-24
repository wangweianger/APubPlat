'use strict';

const path = require('path');

exports.ejs = {
    enable: true,
    package: 'egg-view-ejs',
};

exports.routerPlus = {
    enable: true,
    package: 'egg-router-plus',
};

exports.cors = {
    enable: true,
    package: 'egg-cors',
};

exports.email = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-email'),
};
