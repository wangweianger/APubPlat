// 七牛JDK
'use strict';

const Service = require('egg').Service;
const qiniu = require('qiniu');

class QiniuService extends Service {

    init(){
        const qiniuConfig = this.app.config.qiniu || {};
        this.bucket = qiniuConfig.bucket;
        this.mac = new qiniu.auth.digest.Mac(qiniuConfig.ACCESS_KEY, qiniuConfig.SECRET_KEY);
    }

    //构建上传策略函数
    getToken(key) {
        this.init();

        const putPolicy = new qiniu.rs.PutPolicy({
            scope: this.bucket,
            expires: 7200
        });

        const uploadToken = putPolicy.uploadToken(this.mac);

        return uploadToken;
    }

    getKey(num = 15){
        return this.app.randomString(num);
    }

    //调用uploadFile上传    
    async upload(filePath) {
        filePath = filePath || ''
        //生成上传 Token
        let token = this.getToken();
        //要上传文件的本地路径
        let key = this.getKey();
        let imgs = await this.uploadFile(token, key, filePath)
        return imgs
    }

    // 上传文件
    uploadFile(uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        return new Promise((resolve, reject) => {
            qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
                if (!err) {
                    // 上传成功， 处理返回值
                    resolve(ret.key)
                } else {
                    // 上传失败， 处理返回代码
                    reject(err)
                }
            });
        });
    }

}

module.exports = QiniuService;



