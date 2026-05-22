FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/bin/sh", "-c", "sed -i 's|http://backend:8080|'\"${BACKEND_URL:-http://backend:8080}\"'|g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
