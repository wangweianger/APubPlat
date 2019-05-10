
'use strict';

const debug = require('debug');
const SSH = require('ssh2').Client;

// public
module.exports = function socket(json) {
    const socket = json.socket.socket;
    const conn = new SSH();

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
            setTimeout(() => { json.initial_task && stream.write(json.initial_task); }, 1000);

            if (err) {
                socket.emit(json.socket.close || 'close', 1);
                conn.end();
                return;
            }

            socket.on(json.socket.data || 'data', function socketOnData(data) {
                stream.write(data);
            });

            socket.on('resize', function socketOnResize(data) {
                stream.setWindow(data.rows, data.cols);
            });

            // socket.on('disconnecting', function socketOnDisconnecting(reason) {
            //     socket.emit(json.socket.close || 'close', 1);
            //     debug('SOCKET DISCONNECTING: ' + reason);
            // });
            // socket.on('disconnect', function socketOnDisconnect(reason) {
            //     debug('SOCKET DISCONNECT: ' + reason);
            //     err = { message: reason };
            //     debug('CLIENT SOCKET DISCONNECT', err);
            //     socket.emit(json.socket.close || 'close', 1);
            //     conn.end();
            // });

            // socket.on('error', function socketOnError(err) {
            //     debug('SOCKET ERROR', err);
            //     socket.emit(json.socket.close || 'close', 1);
            //     conn.end();
            // });

            stream.on('data', function streamOnData(data) {
                socket.emit(json.socket.data || 'data', data.toString('utf-8'));
            });
            stream.on('close', function streamOnClose(code, signal) {
                err = { message: ((code || signal) ? (((code) ? 'CODE: ' + code : '') + ((code && signal) ? ' ' : '') + ((signal) ? 'SIGNAL: ' + signal : '')) : undefined) };
                debug('STREAM CLOSE', err);
                socket.emit(json.socket.close || 'close', 1);
                conn.end();
            });
        });
    });

    conn.on('end', function connOnEnd(err) { socket.emit(json.socket.close || 'close', 1); debug('CONN END BY HOST', err); });
    conn.on('close', function connOnClose(err) { socket.emit(json.socket.close || 'close', 1); debug('CONN CLOSE', err); });
    conn.on('error', function connOnError(err) { socket.emit(json.socket.close || 'close', 1); debug('CONN ERROR', err); });

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

