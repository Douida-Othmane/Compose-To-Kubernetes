# Build Stage
FROM eclipse-temurin:17.0.5_8-jdk-ubi9-minimal AS build
COPY ./.mvn ./.mvn
COPY ./mvnw ./mvnw
COPY ./pom.xml ./pom.xml
COPY ./src ./src

RUN ./mvnw install -DskipTests

# Execution Stage
FROM eclipse-temurin:17.0.5_8-jre-ubi9-minimal


COPY --from=build target/Docker2Manifest-1.0.0.jar Docker2Manifest-1.0.0.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "Docker2Manifest-1.0.0.jar"]