FROM microsoft/dotnet:2.1-sdk as build
WORKDIR /app

ENV NODE_VERSION 10.8.0
ENV NODE_DOWNLOAD_SHA D83EA37E53F534996B4477E9A616BFE367F90A62FC50714DCF495F8802090F7B
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs
COPY StarterPack/StarterKit.csproj ./
RUN dotnet restore StarterKit.csproj

COPY StarterPack/. ./
RUN rm wwwroot/dist/*
RUN rm ClientApp/dist/*
#COPY StarterPack/ClientApp \
	#StarterPack/.babelrc \
	#StarterPack/Controllers \
	#StarterPack/Extensions \
	#StarterPack/Migrations \
	#StarterPack/Models \
	#StarterPack/Repository \
	#StarterPack/Services \
	#StarterPack/Views \
	#StarterPack/wwwroot \
	#StarterPack/*.js \
	#StarterPack/*.cs \
	#StarterPack/*.json ./
RUN touch ClientApp/dist react-loadable.json
RUN dotnet publish -c Release -o publish/. 

FROM microsoft/dotnet:2.1-aspnetcore-runtime AS publish
WORKDIR /app
ENV NODE_VERSION 10.8.0
ENV NODE_DOWNLOAD_SHA D83EA37E53F534996B4477E9A616BFE367F90A62FC50714DCF495F8802090F7B
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs
COPY --from=build /app/publish/. ./
#COPY --from=build /app/ClientApp/dist/. ./
#COPY --from=build /app/wwwroot/dist/. ./
ENTRYPOINT ["dotnet", "StarterKit.dll"]

#COPY --from=build /publish .
#COPY --from=build /app/ClientApp/dist ./ClientApp/dist
#COPY --from=build /app/wwwroot/favicon.ico ./wwwroot
#COPY --from=build /app/*.json .