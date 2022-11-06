FROM node:16.18-alpine3.15
LABEL author="leftover"
LABEL github="https://github.com/robot-bingbing/qqRot-interview"
COPY . /qqrot-interview
WORKDIR /qqrot-interview
RUN yarn install
CMD npm run init:database && npm run start
