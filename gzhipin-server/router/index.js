/**
 * Created by 98194 on 2018/10/31.
 */
//引入express模块
const express = requery('express')
//引入md5加密模块
const md5 = require('blueimp-md5')

//引入 Users
const Users = require('../models/users');

//获取 Router
const Router = express.Router;
//创建路由器对象
const router = new Router();

//解析请求体的数据
router.use(express.urlencoded({
   extended:true
}))

//登录
router.post('/login',(req,res) => {
   res.send('login路由的响应 哒哒哒的响应')
})

//注册
router.post('/login',(req,res) => {
   //收集用户提交信息
   const {username,password,type} = req.body;
   console.log(username,password,type);
   //判断用户输入是否合法
   if(!username ||!password || !type){
      //进入判断说明用户输入不合法
      res.json({
         "code": 2,
         "msg": "用户输入不合法"
      });
      return
   }
   // 3. 去数据库查找用户是否存在
   Users.findOne({username}, (err, data) => {
      if (!err) {
         //方法没有出错
         if (data) {
            //找到了指定用户，用户名已存在
            res.json({
               "code": 1,
               "msg": "此用户已存在"
            });
         } else {
            // 4. 将用户信息保存在数据库中
            Users.create({username, password: md5(password), type}, (err, data) => {
               if (!err) {
                  //注册成功
                  res.json({  //将js对象/数组转换成json字符串
                     code: 0,
                     data: {
                        _id: data.id,
                        username: data.username,
                        type: data.type
                     }
                  })
               } else {
                  //方法出错了
                  res.json({
                     "code": 3,
                     "msg": "网络不稳定，请重新试试~"
                  });
               }
            })
         }
      } else {
         //方法出错了
         res.json({
            "code": 3,
            "msg": "网络不稳定，请重新试试~"
         });
      }
   })
})

//注册
router.post('/register',async (req, res) => {
   // 1. 收集用户提交信息
   const {username, password, type} = req.body;
   console.log(username, password, type);
   // 2. 判断用户输入是否合法
   if (!username || !password || !type) {
      //说明有数据不合法
      res.json({
         "code": 2,
         "msg": "用户输入不合法"
      });
      return;
   }
   try {
      const data = await Users.findOne({username});

      if (data) {
         //返回错误
         res.json({
            "code": 1,
            "msg": "用户名已存在"
         });
      } else {
         const data = await Users.create({username, password: md5(password), type});
         //返回成功的响应
         res.json({
            code: 0,
            data: {
               _id: data.id,
               username: data.username,
               type: data.type
            }
         })
      }
   } catch (e) {
      //说明findOne / create方法出错了
      //返回失败的响应
      res.json({
         "code": 3,
         "msg": "网络不稳定，请重新试试~"
      })
   }

})


//暴露
module.export = router;
