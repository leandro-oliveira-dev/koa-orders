# Dockerfile (desenvolvimento)
FROM node:18-alpine

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências com cache
COPY package*.json ./

# Instala dependências (inclui devDependencies)
RUN npm ci --silent

# Copia todo o código
COPY . .

# Expõe porta da app
EXPOSE 3000

# Comando padrão: usa ts-node para rodar seu entrypoint (index.ts)
# Você pode trocar para ts-node-dev se preferir hot-reload dentro do container,
# mas ts-node é mais simples e geralmente suficiente.
CMD ["npx", "ts-node", "src/index.ts"]
