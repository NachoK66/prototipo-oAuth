# Guía de configuración para desarrollo local

## Software y herramientas utilizados

- [MongoDB](https://www.mongodb.com/try/download/community), una base de datos NoSQL.
- [MongoDB Compass](https://www.mongodb.com/try/download/compass), una interfaz gráfica para MongoDB.
- [Docker Desktop](https://www.docker.com/products/docker-desktop), una plataforma de contenedores.

## Configuración del proyecto de forma local

1. Instala Docker Desktop (puede ser necesario reiniciar el sistema).
2. Clona el repositorio.
3. En la terminal, navega al directorio del proyecto:

    ```bash
    cd *NOMBRE_DE_LA_APLICACIÓN*/
    ```

4. Ejecuta el siguiente comando para iniciar los contenedores de la base de datos:

    ```bash
    docker compose -f ./db/docker-compose.yml up -d
    ```

## Acceso a los contenedores

MongoDB estará en funcionamiento y se puede acceder a través de [localhost:27017](http://localhost:27017).

Puedes acceder a [localhost:8081](http://localhost:8081) con las credenciales predeterminadas (usuario: admin, contraseña: admin) e interactuar con la instancia usando la interfaz web [Mongo Express](https://github.com/mongo-express/mongo-express).

Alternativamente, puedes acceder a la instancia de MongoDB utilizando la interfaz gráfica MongoDB Compass con las credenciales predeterminadas.
