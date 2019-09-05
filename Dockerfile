FROM node
MAINTAINER jack "958691165@qq.com"

#时区设置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

RUN mkdir -p /root/webhook

WORKDIR "/root/webhook"

COPY . .

RUN npm i

RUN mkdir -p /var/www

ENTRYPOINT node index