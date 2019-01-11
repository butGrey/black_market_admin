var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE,
    port     : config.database.PORT
});

let query = ( sql, values ) => {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
            if (err) {
                console.log('---------------'+err.message+'---------------');
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        console.log(err.message);
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })
}
let user =
    `create table if not exists user(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名',
     pass VARCHAR(100) NOT NULL COMMENT '密码',
     PRIMARY KEY ( id )
    );`

let account =
    `create table if not exists account(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(40) NOT NULL COMMENT '账号名',
     price VARCHAR(40) NOT NULL COMMENT '价格',
     sect VARCHAR(40) NOT NULL COMMENT '门派',
     body VARCHAR(40) NOT NULL COMMENT '体型',
     area VARCHAR(40) NOT NULL COMMENT '区服',
     clothing VARCHAR(40) NOT NULL COMMENT '外观',
     equipment VARCHAR(40) NOT NULL COMMENT '装备',
     sketch VARCHAR(40) NOT NULL COMMENT '描述',
     PRIMARY KEY(id) 
    );`
let createTable = ( sql ) => {
    return query( sql, [] )
}
//创建文章表
createTable(account)
createTable(user)
// 注册用户
exports.insertData = ( value ) => {
    let _sql = "insert into user set name=?,pass=?;"
    return query( _sql, value )
}
// 删除用户
exports.deleteUserData = ( name ) => {
    let _sql = `delete from user where name="${name}";`
    return query( _sql )
}
// 查找用户
exports.findUserData = ( name ) => {
    let _sql = `select * from user where name="${name}";`
    return query( _sql )
}
// 通过名字查找用户
exports.findDataByName =  ( name ) => {
    let _sql = `select * from user where name="${name}";`
    return query( _sql)
}
// 通过名字查找用户数量判断是否已经存在
exports.findDataCountByName =  ( name ) => {
    let _sql = `select count(*) as count from user where name="${name}";`
    return query( _sql)
}
// 添加账号
exports.insertAccount = ( value ) => {
    let _sql = "insert into account set name=?,price=?,sect=?,body=?,area=?,clothing=?,equipment=?,sketch=?;"
    return query( _sql, value )
}
// 通过账号id查找
exports.findDataById =  ( id ) => {
    let _sql = `select * from account where id="${id}";`
    return query( _sql)
}
// 查询所有账号
exports.findAllAccount = () => {
    let _sql = `select * from account;`
    return query( _sql)
}
// 查询所有账号
exports.findAllAccountD = () => {
    let _sql = `select * from account order by 1 desc;`
    return query( _sql)
}
// 删除账号
exports.deleteAccount = (id) => {
    let _sql = `delete from account where id = ${id}`
    return query(_sql)
}