FROM node:10

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/queue-mqtt

COPY . .

RUN npm i

CMD ["npm", "start"]
