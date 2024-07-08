FROM node:22-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ARG REACT_APP_API_URL
ARG REACT_APP_HOST

ENV NODE_ENV 'production'
ENV REACT_APP_API_URL ${REACT_APP_API_URL}
ENV REACT_APP_HOST ${REACT_APP_HOST}

RUN npm run build

FROM nginx:stable as deployment

RUN rm /etc/nginx/conf.d/default.conf

COPY /nginx/default.conf.template /etc/nginx/conf.d/default.conf.template

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]