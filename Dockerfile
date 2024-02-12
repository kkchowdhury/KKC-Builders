
FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && apt-get install -y nginx

COPY index.html /app/
COPY css/ /app/css/
COPY js/ /app/js/
COPY images/ /app/images/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
