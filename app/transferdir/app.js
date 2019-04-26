async updatefile(filename, content) {
        content = content.replace(/;/g, '\;');
        content = content.replace(/"/g, '\'');
        await this.ctx.service.ssh2.exec(`echo -e "${content}" > ${filename}`);
    }