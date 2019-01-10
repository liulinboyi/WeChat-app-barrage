## 介绍

本项目基于微信小程序云开发，使用原生框架编写，是一个类弹幕使祝福DEMO。

这个DEMO使用了小程序云开发中的云数据库增、读功能和腾讯地图位置信息反编辑功能。

## 截图

![](https://blogimg-1252809090.cos.ap-chengdu.myqcloud.com/WeChat-app-barrage/WeChat-app-barrage.jpg)

## 使用方法

1. 填写project.config.json中的appid字段
2. 填写miniprogram/pages/index/index.js中key，[申请地址](https://lbs.qq.com/)
3. 上传并部署cloudfuncitions/login 云函数
4. 进入云开发面板创建 doommData 数据库

## 留的坑 

* 众所周知云开发数据库在查询的时候一次最多查询20条数据，在本DEMO中我并没有做处理，所以就给新人留个homework吧，翻阅官方文档，在祝福大于20条时实现分页加载。😉
* 如果你是大佬，有更好的方案欢迎一起讨论。✌️

## 联系我

GitHub: [本文项目仓库](https://github.com/tysb7/WeChat-app-barrage)

WeChat: tysb7_

blog: [www.tysb7.cn](https://www.tysb7.cn/)

Email: <terry@qiaokr.com>

SSl: [环洋诚信™](https://www.trustocean.com/)