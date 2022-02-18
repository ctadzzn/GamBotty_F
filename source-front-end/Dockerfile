FROM node:16.13 as build_client
WORKDIR /client
COPY package.json /client/
COPY package-lock.json /client/
RUN npm install
COPY . /client/
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
RUN npm run build

FROM nginx
COPY --from=build_client /client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
