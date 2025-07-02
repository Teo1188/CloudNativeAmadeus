# FETCH DOTNET 9.0

FROM mcr.microsoft.com/dotnet/nightly/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src
COPY [".", "."]
RUN dotnet restore "./ExtraHours.API/./ExtraHours.API.csproj"

COPY . .
RUN dotnet test
RUN dotnet build -c $BUILD_CONFIGURATION
CMD ["dotnet", "watch"]