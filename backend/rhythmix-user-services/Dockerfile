# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers,
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the code,
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Runtime stage,
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Optional: Expose port (for web apps),
EXPOSE 8080

# Entry point,
ENTRYPOINT ["dotnet", "rhythmix_user_services.dll"]
