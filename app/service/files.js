// 七牛JDK
'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const util = require('../util/utils');

class FilesService extends Service {

    // add files
    async addfile(filename, content, remotePath) {
        // 中转站文件夹
        const file = path.resolve(__dirname, '../transferdir', filename);
        fs.writeFileSync(file, content);
        remotePath = util.isDirEnd(remotePath) ? `${remotePath}${filename}` : `${remotePath}/${filename}`;
        await this.ctx.service.sftp.fastPut(file, remotePath);
        fs.unlinkSync(file);
        return {};
    }

    // update files
    async updatefile(filename, content) {
        content = content.replace(/;/g, '\;');
        content = content.replace(/"/g, '\'');
        await this.ctx.service.ssh2.exec(`echo -e "${content}" > ${filename}`);
    }


}

module.exports = FilesService;
