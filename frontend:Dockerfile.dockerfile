FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files
COPY index.html /usr/share/nginx/html/

# Create non-root user
RUN adduser -D static
RUN chown -R static:static /usr/share/nginx/html
RUN chown -R static:static /var/cache/nginx
RUN chown -R static:static /var/log/nginx
RUN touch /var/run/nginx.pid
RUN chown -R static:static /var/run/nginx.pid

USER static

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]