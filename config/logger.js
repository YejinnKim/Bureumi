const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const appRoot = require('app-root-path');
const process = require('process');
const path = require('path')

const logDir = `${appRoot}/config/logs`;

const {
    combine,
    timestamp,
    label,
    printf
} = winston.format;

const logFormat = printf(({
    level,
    message,
    label,
    timestamp
}) => {
    return `${timestamp} [${label}] ${level}: ${message}`; // log 출력 포맷 정의
});
/* 
Log Level
error: 0, warn : 1, info : 2, verbose : 4, debug : 5, silly : 6
 */

const logger = winston.createLogger({
    format:combine(
        label({
            label:' Bureumi '
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat // log 출력 포맷
    ),
    transports: [
        //info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level:'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,

        }),
        new winstonDaily({ //error 레벨 로그만 별도로 관리
            level:'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.errorlog`,
            maxFiles: 30,
            zippedArchive: true
            
        })
    ],
    exceptionHandlers: [ //uncaughtException 관리 파일
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
            zippedArchive: true,
        })
    ]
});


module.exports = logger;