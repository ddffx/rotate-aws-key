FROM node:alpine

# Install dependencies 
RUN npm set progress=false && \
    npm install -g --progress=false yarn

CMD [bin/sh]