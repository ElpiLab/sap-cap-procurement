# syntax=docker/dockerfile:1

ARG VARIANT="20"
FROM mcr.microsoft.com/devcontainers/javascript-node:1-${VARIANT}-bookworm

# Install useful tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Install SAP CAP SDK
USER node
RUN npm install -g @sap/cds-dk

WORKDIR /workspaces
