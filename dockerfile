FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

# COPY --from=build /dist/dairy_ui /usr/share/nginx/html

COPY ["dist/dairy_ui","/usr/share/nginx/html"]

EXPOSE 3000
