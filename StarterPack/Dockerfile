FROM microsoft/dotnet:2.1-sdk as build
WORKDIR /app

ENV NODE_VERSION 8.9.4
ENV NODE_DOWNLOAD_SHA 21fb4690e349f82d708ae766def01d7fec1b085ce1f5ab30d9bda8ee126ca8fc
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs
RUN npm install node-sass@latest webpack

COPY StarterPack/StarterKit.csproj .
RUN dotnet restore StarterKit.csproj

COPY . .
RUN dotnet publish StarterKit.csproj -c Release -o /app/publish

FROM microsoft/dotnet:2.1-aspnetcore-runtime AS publish
WORKDIR /app/publish
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "StarterKit.dll"]

#COPY --from=build /publish .
#COPY --from=build /app/ClientApp/dist ./ClientApp/dist
#COPY --from=build /app/wwwroot/dist ./wwwroot/dist
#COPY --from=build /app/wwwroot/favicon.ico ./wwwroot
#COPY --from=build /app/*.json .