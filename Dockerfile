FROM busybox:latest

# Copy your static files into the image
COPY ./static /www

WORKDIR /www

EXPOSE 80

CMD ["httpd", "-f", "-v", "-p", "80"]