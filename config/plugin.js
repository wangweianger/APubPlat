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

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};

exports.email = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-email'),
};

// exports.redis = {
//     enable: true,
//     package: 'egg-redis',
// };

exports.io = {
    enable: true,
    package: 'egg-socket.io',
};
