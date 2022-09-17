
<div align="center">
<img src="https://api.leftover.cn/api/last-updated/shields?owner=left0ver&repo=qqRot-interview"/>
<img src="https://img.shields.io/github/license/left0ver/qqRot-interview"/>
<img src="https://img.shields.io/github/package-json/v/left0ver/qqRot-interview"/>
<img src="https://img.shields.io/badge/language-typescript-blue"/>
<img src="https://img.shields.io/badge/database-mysql-%230074a3"/>
<img src="https://visitor-badge.glitch.me/badge?page_id=left0ver.qqRot-interview"/>
</div>

# overview

该项目是基于[oicq](https://github.com/takayama-lily/oicq)的一个qq机器人，用于每日定时向qq群里面发送面试题，支持部署到自己的服务器,前端使用ts，数据库使用mysql

# setup
``` shell
git clone  --depth=1 https://github.com/left0ver/qqRot-interview.git
```
## 初始化数据库

打开你的mysql数据库，新建一个数据库，运行项目根目录下的sql文件导入表结构，表结构如下所示

![leftover](https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/20220916213014-2022-09-16.png)

- qid:主键
- question：问题（面试题）
- isSend：是否已经发送过该面试题，0表示未发送，1表示已发送
```
yarn install # 下载依赖

cd qqRot-interview

cp lib/config.example.ts /lib/config.ts

修改lib/config.ts文件里的配置即可，配置自己的qq号和qq密码，以及数据库的一些配置

启动：
开发环境下运行 yarn start:dev

生产环境下运行 yarn start:prod
```

# 命令options
1. 默认情况下是发送第一条没有发过的的面试题
如果你想要随机从数据库中发送一条面试题，你可以在原有的命令后面加上 random=true
2. 一般情况下你可以在lib/config.ts下面配置你想要发送的群（机器人必须在群里才可以），当然你也可以使用命令行的方式指定发送到某个群，在原有的命令后面加上  groupId=[your group number]

> eg: yarn start:prod random=true groupId=123456789


# 登陆
第一次运行需要滑块登陆，同时会在lib目录下生成一个data文件夹（不要删除），同时命令行里会提示让你填写ticket，点击链接跳转到滑块登陆页面，打开开发者工具，移动滑块登陆之后，从开发者工具网络请求cap_union_new_verity中得到ticket，复制粘贴到命令行中即可登陆（之后可不用重复登陆）

# 部署

将本地项目传到服务器上，并下载好依赖，在服务器上配置好数据库

```shell
echo $PATH #复制结果

crontab -e  # 创建定时任务
将复制的结果粘贴到第一行  # 因为crontab里面的环境和服务器上的环境不一致，所以需要先设置一下crontab的环境

# 设置定时任务 ，类似下图框出来的部分，替换一下路径和命令即可,图中设置的是每日10点发送面试题
```

<img src="https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/20220916231710-2022-09-16.png"/>

对于定时任务不了解的同学可以看一下这个[教程](https://www.cnblogs.com/colinliu/p/crontab.html)

**部署到服务器之后最好自己先运行一遍，因为换了一台电脑，可能会出现qq需要重新登陆到情况**

# TODO：
 - [ ] 使用github action 做定时任务

# License

[MIT](https://github.com/left0ver/qqRot-interview/blob/main/LICENSE)

如果觉得本项目对您有帮助，那就点个star吧 💕
