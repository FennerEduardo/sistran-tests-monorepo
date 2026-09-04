FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["BackendAPI.csproj", "./"]
RUN dotnet restore "BackendAPI.csproj"
COPY . .
RUN dotnet build "BackendAPI.csproj" -c Release -o /app/build
RUN dotnet publish "BackendAPI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BackendAPI.dll"]
