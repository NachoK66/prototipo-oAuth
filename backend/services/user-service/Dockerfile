# Usa una imagen base de Node.js
FROM node:18

# Crea el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración de NPM
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente de la aplicación
COPY . .

# Expone el puerto en el que correrá el servicio
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "src/app.js"]
