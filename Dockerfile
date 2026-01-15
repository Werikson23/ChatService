# Use Node.js oficial (alpine para imagem leve)
FROM node:20-alpine

# Diretório de trabalho no container
WORKDIR /app

# Instala dependências do sistema necessárias
RUN apk add --no-cache bash git

# Copia package.json e package-lock.json para aproveitar cache
COPY package*.json ./

# Instala dependências
RUN npm install

# Instala nodemon globalmente para desenvolvimento
RUN npm install -g nodemon ts-node typescript

# Copia o restante do código
COPY . .

# Expõe porta
EXPOSE 3001

# Comando de desenvolvimento (hot reload)
CMD ["npm", "run", "dev"]
