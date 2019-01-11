const router = require('koa-router')();
const config = require('../config/default.js');
const sql = require('../lib/mysql.js');
const moment = require('moment');
const fs = require('fs');
const md = require('markdown-it')();
const path = require('path');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin


router.get('/register', async ctx => {
    await checkNotLogin(ctx)
    await ctx.render('register', {
        session: ctx.session,
    })
})
router.post('/register', async ctx => {
    let { name, password, repeatpass } = ctx.request.body
    console.log(typeof password)
    await sql.findDataCountByName(name)
        .then(async (result) => {
            console.log(result)
            if (result[0].count >= 1) {
                // 用户存在
                ctx.body = {
                    code: 500,
                    message: '用户存在'
                };
            } else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: 500,
                    message: '两次输入的密码不一致'
                };
            }else {
                await sql.insertData([name, md5(password)])
                    .then(res => {
                        console.log('注册成功', res)
                        //注册成功
                        ctx.body = {
                            code: 200,
                            message: '注册成功'
                        };
                    })
            }
        })
})
router.get('/login', async ctx => {
    await checkNotLogin(ctx)
    await ctx.render('login', {
        session: ctx.session,
    })
})
router.post('/login', async ctx => {
    console.log(ctx.request.body)
    let { name, password } = ctx.request.body
    await sql.findDataByName(name)
        .then(result => {
            let res = result
            if (res.length && name === res[0]['name'] && md5(password) === res[0]['pass']) {
                ctx.session = {
                    user: res[0]['name'],
                    id: res[0]['id']
                }
                ctx.body = {
                    code: 200,
                    message: '登录成功'
                }
                console.log('ctx.session.id', ctx.session.id)
                console.log('session', ctx.session)
                console.log('登录成功')
            } else {
                ctx.body = {
                    code: 500,
                    message: '用户名或密码错误'
                }
                console.log('用户名或密码错误!')
            }
        }).catch(err => {
            console.log(err)
        })
})
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
