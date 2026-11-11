# Node 26 fica na imagem: o projeto inicia sem a linguagem instalada na máquina.
FROM node:26

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]
