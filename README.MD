# Nombre de tu API

Api rest realizada con node.js, se implemento el sistema de autenticacion con usuarios, roles y permisos,el cual se hizo mediante la implementacion de jsonwebtoken

## Requisitos

- Node.js 
- Docker 
- DBeaver (opcional)

## Instalación


1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git


```

2. Ejecuta el siguiente comando para levantar el contenedor de Docker con MySQL:


```
docker run -d -p 3306:3306 --name mysql-db -e MYSQL_ROOT_PASSWORD=12345 mysql
```

3. Copia el archivo env.template y renómbralo como .env. Asegúrate de editar este archivo y agregar los valores necesarios para las variables de entorno requeridas por tu API.

```
.env.template a .env
```

4. Instala las dependencias del proyecto utilizando npm:

```
npm install, yarn , pnpm install
```


5. Realiza las configuraciones adicionales necesarias en la API, como la conexión a la base de datos y otros ajustes específicos para tu caso de uso.

```
puedes usar mysql o postgres, en mi caso use postgres
```

6. Inicia la API:

```
npm run dev / npm run start 
```



¡Listo! Tu API ahora está en funcionamiento y lista para recibir solicitudes. Asegúrate de consultar la documentación proporcionada para obtener más detalles sobre los endpoints y cómo interactuar con la API.