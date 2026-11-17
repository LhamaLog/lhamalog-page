# Node 26 fica na imagem: o projeto inicia sem a linguagem instalada na máquina.
FROM node:26

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

# A imagem serve a página já gerada. O servidor de desenvolvimento, e o ajuste dos planos, não entram aqui.
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000", "--strictPort"]
