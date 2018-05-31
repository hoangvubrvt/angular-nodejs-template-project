FROM keymetrics/pm2:8-alpine
ENV NODE_ENV production
ENV PORT 80
RUN pm2 install pm2-server-monit
WORKDIR /usr/src/app
COPY ./backend/ .
RUN npm install
EXPOSE 80
CMD [ "pm2-runtime", "start", "process.yml" ]