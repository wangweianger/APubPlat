
'use strict';

const debug = require('debug');
const SSH = require('ssh2').Client;

// public
module.exports = function socket(json) {
    const socket = json.socket.socket;
    const conn = new SSH();
    let isEnd = false;
    let isSend = false;
    let isSuccess = false;
    let timer = null;
    const timeout = 1000;
    const regExp = new RegExp(`\\[${json.username || ''}@.+?\\]`);
    const socketIndex = json.socket.data.split('_').splice(-1).join();

    socket.on(json.socket.geometry || 'geometry', function socketOnGeometry(cols, rows) {
        json.cols = cols;
        json.rows = rows;
    });

    conn.on('ready', function connOnReady() {
        conn.shell({
            term: json.term,
            cols: json.cols,
            rows: json.rows,
        }, function connShell(err, stream) {
            setTimeout(() => { json.initialTask && stream.write(json.initialTask); }, 1000);

            if (err) {
                socket.emit(json.socket.close || 'close', 'SSH2 CONN ERROR');
                conn.end();
                return;
            }

            socket.on(json.socket.data || 'data', function socketOnData(data) {
                if (isEnd) isEnd = false;
                if (isSuccess) isSuccess = false;
                stream.write(data);
            });

            socket.on(json.socket.close || 'close', function() {
                conn.end();
            });

            socket.on('resize', function socketOnResize(data) {
                stream.setWindow(data.rows, data.cols);
            });

            socket.on('disconnect', function socketOnDisconnect(reason) {
                err = { message: reason };
                debug('CLIENT SOCKET DISCONNECT', err);
                socket.emit(json.socket.close || 'close', 'CLIENT SOCKET DISCONNECT');
                conn.end();
            });

            socket.on('error', function socketOnError(err) {
                debug('SOCKET ERROR', err);
                socket.emit(json.socket.close || 'close', 'SOCKET ERROR');
                conn.end();
            });

            stream.on('close', function streamOnClose(code, signal) {
                err = { message: ((code || signal) ? (((code) ? 'CODE: ' + code : '') + ((code && signal) ? ' ' : '') + ((signal) ? 'SIGNAL: ' + signal : '')) : undefined) };
                debug('STREAM CLOSE', err);
                socket.emit(json.socket.close || 'close', 'STREAM CLOSE');
                conn.end();
            });

            stream.on('data', function streamOnData(data) {
                data = data.toString('utf-8');
                socket.emit(json.socket.data || 'data', data);
                // 执行成功
                if (data.indexOf('SUCCESSFUL_COMMAND_CONSTRUCTION') > -1) isSuccess = true;
                if (timer) clearTimeout(timer);
                if (regExp.test(data)) {
                    timer = setTimeout(() => {
                        isEnd = true;
                        if (!isSend) {
                            socket.emit(json.socket.end || 'data', {
                                isSuccess, isEnd,
                                date: json.date || new Date(),
                                index: socketIndex,
                            });
                        }
                        isSend = true;
                    }, timeout);
                }
            });
        });
    });

    conn.on('end', function connOnEnd(err) { socket.emit(json.socket.close || 'close', 'CONN END BY HOST'); debug('CONN END BY HOST', err); });
    conn.on('close', function connOnClose(err) { socket.emit(json.socket.close || 'close', 'CONN CLOSE'); debug('CONN CLOSE', err); });
    conn.on('error', function connOnError(err) { socket.emit(json.socket.close || 'close', 'CONN ERROR'); debug('CONN ERROR', err); });

    if (json.username && json.password) {
        conn.connect({
            host: json.host,
            port: json.port,
            username: json.username,
            password: json.password,
            tryKeyboard: true,
            readyTimeout: 20000,
            keepaliveInterval: 120000,
            keepaliveCountMax: 30,
            debug: debug('ssh2'),
        });
    } else {
        socket.emit(json.socket.close || 'close', 1);
    }
};

