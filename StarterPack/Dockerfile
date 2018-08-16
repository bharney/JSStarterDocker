# escape=`
FROM microsoft/dotnet:2.1.300-preview1-sdk-nanoserver-sac2016 as build 
WORKDIR /app
# set up environment
ENV ASPNETCORE_URLS http://+:80

## https://nodejs.org/dist/v8.9.4/
ENV NODE_VERSION 8.9.4
ENV NODE_DOWNLOAD_SHA 48946e99ac4484e071df25741d2300f3a656f476c5ff3f8116a4746c07ebe3b7

RUN Invoke-WebRequest -UseBasicParsing https://nodejs.org/dist/v${env:NODE_VERSION}/node-v${env:NODE_VERSION}-win-x64.zip -outfile node.zip; `
    if ((Get-FileHash node.zip -Algorithm sha256).Hash -ne $env:NODE_DOWNLOAD_SHA) { `
        Write-Host 'NODEJS CHECKSUM VERIFICATION FAILED!'; `
        exit 1; `
    }; `
    `
    Expand-Archive node.zip -DestinationPath nodejs-tmp; `
    Move-Item nodejs-tmp/node-v${env:NODE_VERSION}-win-x64 "${Env:ProgramFiles}/nodejs"; `
    Remove-Item -Force node.zip; `
    Remove-Item -Force nodejs-tmp

RUN setx /M PATH $($Env:PATH + ';' + $Env:ProgramFiles + '/nodejs')

COPY StarterPack/StarterKit.csproj ./
RUN dotnet restore StarterKit.csproj

COPY StarterPack/. ./
RUN rm wwwroot/dist/*
RUN rm ClientApp/dist/*
RUN New-Item -Path ClientApp/dist -Name "react-loadable.json"

WORKDIR /app
RUN dotnet publish -c Release -o publish/. 

FROM microsoft/nanoserver:sac2016 AS publish
WORKDIR /app

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# set up network
ENV ASPNETCORE_URLS http://+:80

# Retrieve ASP.NET Core Runtime
ENV ASPNETCORE_VERSION 2.1.2

RUN Invoke-WebRequest -OutFile aspnetcore.zip https://dotnetcli.blob.core.windows.net/dotnet/aspnetcore/Runtime/$Env:ASPNETCORE_VERSION/aspnetcore-runtime-$Env:ASPNETCORE_VERSION-win-x64.zip; `
    Expand-Archive aspnetcore.zip -DestinationPath  $Env:ProgramFiles\dotnet; `
    Remove-Item -Force aspnetcore.zip
RUN setx /M PATH $($Env:PATH + ';' + $Env:ProgramFiles + '\dotnet')
## https://nodejs.org/dist/v8.9.4/
ENV NODE_VERSION 8.9.4
ENV NODE_DOWNLOAD_SHA 48946e99ac4484e071df25741d2300f3a656f476c5ff3f8116a4746c07ebe3b7

RUN Invoke-WebRequest -UseBasicParsing https://nodejs.org/dist/v${env:NODE_VERSION}/node-v${env:NODE_VERSION}-win-x64.zip -outfile node.zip; `
    if ((Get-FileHash node.zip -Algorithm sha256).Hash -ne $env:NODE_DOWNLOAD_SHA) { `
        Write-Host 'NODEJS CHECKSUM VERIFICATION FAILED!'; `
        exit 1; `
    }; `
    `
    Expand-Archive node.zip -DestinationPath nodejs-tmp; `
    Move-Item nodejs-tmp/node-v${env:NODE_VERSION}-win-x64 "${Env:ProgramFiles}/nodejs"; `
    Remove-Item -Force node.zip; `
    Remove-Item -Force nodejs-tmp

RUN setx /M PATH $($Env:PATH + ';' + $Env:ProgramFiles + '/nodejs')

COPY --from=build /app/publish/. ./
ENTRYPOINT ["dotnet", "StarterKit.dll"]
