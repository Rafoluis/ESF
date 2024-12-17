import mysql from 'serverless-mysql'

export const conn = mysql({
    config: {
        host: 'localhost',
        user: 'root',
        password: '123456789*jrcl',
        port: 3306,
        database: 'nextmysql'
    }
})