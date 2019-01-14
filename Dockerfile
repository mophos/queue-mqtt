FROM mophos/node:10

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/mqtt

COPY . .

CMD ["node", "server.js"]