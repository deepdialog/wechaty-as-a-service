FROM node:10
RUN apt-get update && apt-get install -y chromium libatk-bridge2.0-0 libgtk-3-0
COPY ./bot /bot
WORKDIR /bot
RUN npm i
CMD bash start.sh
