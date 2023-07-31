FROM node:18.17.0-slim@sha256:479c8ad8e42c5a6faae5f6b68422752d6d04572e342e5d57294491b583905416 as client-build
COPY ./client /client
WORKDIR /client
RUN npm ci
RUN npm run build

FROM maven:3.9.3-eclipse-temurin-17-alpine@sha256:1cbc71cb8e2f594338f4b4cbca897b9f9ed6183e361489f1f7db770d57efe839 AS server-builder
COPY ./server/src /server/src
COPY --from=client-build ./client/dist /server/src/main/resources/static
COPY ./server/pom.xml /server/pom.xml
WORKDIR /server
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17.0.7_7-jre-alpine@sha256:7cbe01fd3d515407f1fda1e68068831aa6ae4b6930d76cdaa43736dc810bbd1b
RUN apk add dumb-init
RUN addgroup --system juser && adduser -S -s /bin/false -G juser juser
COPY --from=server-builder /server/target/battleship-0.0.1.jar /app/
WORKDIR /app
RUN chown -R juser:juser /app
USER juser
ENTRYPOINT ["dumb-init", "java", "-jar", "battleship-0.0.1.jar"]