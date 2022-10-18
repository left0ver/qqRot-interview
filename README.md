<div align="center">
<img src="https://api.leftover.cn/api/last-updated/shields?owner=robot-bingbing&repo=qqRot-interview"/>
<img src="https://img.shields.io/github/license/robot-bingbing/qqRot-interview"/>
<img src="https://img.shields.io/github/package-json/v/robot-bingbing/qqRot-interview"/>
<img src="https://img.shields.io/badge/language-typescript-blue"/>
<img src="https://img.shields.io/badge/database-mysql-%230074a3"/>
<img src="https://visitor.leftover.cn?id=robot-bingbing.qqRot-interview"/>
</div>

如果觉得本项目对您有帮助，那就点个 star 吧 💕

# overview

该项目是基于[oicq](https://github.com/takayama-lily/oicq)的一个 qq 机器人，用于每日定时向 qq 群里面发送面试题，支持部署到自己的服务器,前端使用 ts，数据库使用 mysql。

[add-interview](https://github.com/robot-bingbing/add-interview)可以帮助您快速地向数据库中录入面试题，您可以将其部署到自己的服务器上。

# Example

![leftover](https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/20220925172408-2022-09-25.png)

# Feature

- :rocket: 定时发送面试题
- :tada: 支持自定义群号，是否随机发送面试题，是否 at 全体成员

# setup

```shell
git clone  --depth=1 https://github.com/robot-bingbing/qqRot-interview.git

cd qqRot-interview

yarn install # 下载依赖

cp lib/config.example.ts lib/config.ts

在mysql中新建一个数据库

修改lib/config.ts文件里的配置即可，配置自己的qq号和qq密码，以及配置对应数据库的一些配置

yarn init:database:dev  or yarn init:database:prod   # 初始化数据库，自动生成表结构
# 如果成功，终端会出现 "成功初始化表结构的字样" ,失败则会出现 "初始化表结构失败"的字样

启动： # 第一次会提示你登陆
开发环境下运行 yarn start:dev  # 会读取lib/config.ts文件里面不同环境下的数据库的配置

生产环境下运行 yarn start:prod
```

# 登陆

第一次运行需要滑块登陆，同时会在 lib 目录下生成一个 data 文件夹（不要删除），
同时命令行里会提示让你填写 ticket，点击链接跳转到滑块登陆页面，先打开开发者工具，
再移动滑块登陆，之后从开发者工具网络请求中 cap_union_new_verity 中得到 ticket，复制它的值粘贴到命令行中即可登陆（之后可不用重复登陆）

# 命令 options

1. 默认情况下是发送第一条没有发过的的面试题
   如果你想要随机从数据库中发送一条面试题，你可以在原有的命令后面加上 random=true
2. 一般情况下你可以在 `lib/config.ts` 下面配置你想要发送的群（机器人必须在群里才可以），你也可以使用命令行的方式指定发送到某个群，在原有的命令后面加上 `groupId=[your group number]` （命令行的优先级高于配置文件）
3. 你可以指定是否在发送面试题的时候 at 全体成员，默认不 at 全体，在原有的命令后面添加 `atall=true` 即可艾特全体成员(如果机器人有 at 全体成员的次数)

> eg: yarn start:prod random=true groupId=123456789 atall=true
> ![leftover](https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/20220926235806-2022-09-26.png)

# 部署

将本地项目传到服务器上，并下载好依赖，在服务器上配置好数据库

```shell
echo $PATH #复制输出的结果

crontab -e  # 创建定时任务

将复制的结果粘贴到第一行  # 因为crontab里面的环境和服务器上的环境不一致，所以需要先设置一下crontab的环境

# 设置定时任务 ，类似下图框出来的部分，替换一下路径和命令即可,图中设置的是每日10点发送面试题
00 10 * * * cd /www/wwwroot/server/qqRot-interview && yarn start:prod  groupId=782234631
```

<img src="https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/20220916231710-2022-09-16 (1)-2022-10-16.png"/>

对于定时任务不了解的同学可以看一下这个[教程](https://www.cnblogs.com/colinliu/p/crontab.html)

**部署到服务器之后最好自己先运行一遍，因为换了一台电脑，可能会出现 qq 需要重新登陆到情况**

# TODO：

- [ ] ~~使用 github action 做定时任务~~
- [x] 使用 typeorm 来重构数据库的操作
- [x] 搭建一个前台用来录入面试题
- [ ] 添加对微信机器人的支持
- [ ] 添加查询天气预报的功能
- [ ] 使用 vuepress 或者 vitepress 来编写使用文档

# License

[MIT](https://github.com/robot-bingbing/qqRot-interview/blob/main/LICENSE)
