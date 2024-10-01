# Usamos una imagen base de Node.js
FROM node:14

#directorio de trabajo en el contenedor
WORKDIR /Laboratory_1

COPY package*.json ./

# Instalamos las dependencias 
RUN npm install
RUN npm install express --save
RUN npm install axios --save


# Copiamos el resto del código de la aplicación al directorio de trabajo
COPY . .

# Exponemos el puerto en el que se ejecutará la aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["node", "Instance_server1.js"]
