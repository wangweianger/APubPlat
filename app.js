'use strict';
const { init } = require('mysqls');

module.exports = async app => {
    const mysql = app.config.mysql;
    if (mysql.run){
        app.beforeStart(async () => {
            // mysql 数据库
            init({
                host: mysql.host,
                user: mysql.user,
                password: mysql.password,
                database: mysql.database,
                port: mysql.port,
            })
        });
    }
};
