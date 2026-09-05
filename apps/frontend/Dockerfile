FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npx typedoc

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/docs /usr/share/nginx/html/docs
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files \$uri \$uri/ /index.html; } location /docs { alias /usr/share/nginx/html/docs; index index.html; } location /api/ { proxy_pass http://backend:8080/api/; } location /swagger/ { proxy_pass http://backend:8080/swagger/; } }" > /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
