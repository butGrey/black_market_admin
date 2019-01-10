const router = require('koa-router')();
//const common = require('../module/common.js');
const config = require('../config/default.js');
const sql = require('../lib/mysql.js');
const moment = require('moment');
const fs = require('fs');
const md = require('markdown-it')();
const path = require('path');

//主页面展示所有账号
router.get('/account',async(ctx)=>{
    let accounts;
    await sql.findAllAccount()
        .then(res => {
            accounts = res
        });
    await ctx.render('trading_platform',{
        accounts:accounts
    })
});
//主页面删改账号
router.post('/account',async(ctx)=>{
    let {id} = ctx.request.body;
    await sql.deleteAccount(id)
        .then(()=>{
            ctx.body = {
                code: 200,
                message: '删除账号成功'
            }
        }).catch(()=> {
            ctx.body = {
                code: 500,
                message: '删除账号失败'
            }
        })
});
//添加账号-路由
router.get('/account_add',async(ctx)=>{
    await ctx.render('account_add');
});
//添加账号-数据
router.post('/account_adds',async (ctx)=> {
    let {name, price, sect, body, area, clothing, equipment, sketch} = ctx.request.body;
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    await  sql.insertAccount([name, price, sect, body, area, clothing, equipment, sketch])
        .then(()=> {
            ctx.body = {
                code: 200,
                message: '上传账号成功'
            }
        }).catch(()=> {
            ctx.body = {
                code: 500,
                message: '上传账号失败'
            }
        })
});

module.exports =router.routes();
