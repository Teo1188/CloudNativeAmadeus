# Build stage
FROM mcr.microsoft.com/dotnet/nightly/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "./ExtraHours.API/ExtraHours.API.csproj"
RUN dotnet publish "./ExtraHours.API/ExtraHours.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/nightly/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000
CMD ["dotnet", "ExtraHours.API.dll"]