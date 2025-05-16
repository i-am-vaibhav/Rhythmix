# Step 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy project files
COPY pom.xml ./
COPY src ./src

# Build the project (skip tests if not needed)
RUN mvn clean package -DskipTests

# Step 2: Use a lightweight base image to run the app
FROM eclipse-temurin:21-jdk-alpine

# Set work directory
WORKDIR /app

# Copy the jar file from the builder stage
COPY --from=build /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8200

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
