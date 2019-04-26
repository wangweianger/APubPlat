
'use strict';

class Util {

    constructor() {
        this.name = '';
    }

    // 判断路径最后是否有 /
    isDirEnd(path) {
        if (!path) return '';
        path = path.trim();
        let result = false;
        const last = path.substr(-1);
        if (last === '/') {
            result = true;
        } else {
            result = false;
        }
        return result;
    }

}

module.exports = new Util();
