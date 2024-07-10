# Node.js Secure Storage API

Esta es una API RESTful para el almacenamiento seguro de archivos en una base de datos PostgreSQL utilizando Express. Utiliza autenticacion con JWT y permite generar links de descarga de unico uso. Fue creada con propositos de aprendizaje y para que sirva como punto de partida a la hora de crear una CRUD API.

+ Operaciones basicas permitidas: subir, listar, descargar y eliminar
+ Cada usuario solo tiene acceso a sus propios archivos
+ Es posible solicitar un token de un solo uso para descargar un archivo resguardado unicamente a partir de un link

## Configuracion

Para correr esta aplicacion necesitaras tener instalados Node.js y PostgreSQL en tu sistema. Clona el repositorio en tu maquina y navega al directorio del proyecto:

```
git clone https://github.com/ramiromiglio/secure-storage
cd secure-storage
```

Instala las dependencias requeridas
```
npm install
```
Crea la base de datos y sus respectivas tablas. Los comandos SQL se encuentran en el archivo ```source/scripts/db.sql```. Puedes utilizar el siguiente comando para correrlos:
```
psql -U YOUR_POSTGRES_USERNAME -a -f source/scripts/db.sql
```

## Uso

Despliega el servidor:
```
npm start
```
El puerto por defecto es el 3000, pero puedes cambiarlo modificando la variable ```DB_PORT``` del archivo ```.env```

## API Routes

Antes de poder hacer cualquier cosa con los archivos es necesario registrarse o iniciar sesion. En caso de un registro o inicio de sesion exitoso, la respuesta contendra un JWT que servira para autenticar al usuario en llamadas posteriores a la API.

### /api/auth/signup

+ HTTP Method: POST
+ Request body:
  + ```username```: El nombre de usuario
  + ```password```: La clave
+ Response:
  + 201 Created: Devuelve un JSON con el nombre de usuario y el token de autenticacion
  + 409 Conflict: Ya existe un usuario con ese nombre de usuario
  + 500 Interal Server Error
```
{
  "user": "ramiromiglio",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRt2MDY3fQ.KvZjZAp2CvIl_2dWzCozLvLUNjvUQXbCdyXMZBBsq2k"
}
```
  
### /api/auth/signin

+ HTTP Method: POST
+ Request body:
  + ```username```: El nombre de usuario
  + ```password```: La clave
+ Response:
  + 409 Conflict: Ya existe un usuario con ese nombre de usuario
  + 201 Created: Devuelve un JSON con el nombre de usuario y el token de autenticacion:
```
{
  "user": "ramiromiglio",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRt2MDY3fQ.KvZjZAp2CvIl_2dWzCozLvLUNjvUQXbCdyXMZBBsq2k"
}
```

> [!NOTE]
> Es posible obtener la misma respuesta llamando al endpoint ```/api/auth/signin``` luego de un registro exitoso.

### Validacion de la solicitud

El servidor realiza la validacion del cuerpo de las solicitudes utilizando el middleware schema-validator. Internamente la instancia del middleware se obtiene llamando a ```schemaValidator``` pasando como argumento un identificador de esquema (previamente registrado con ```defineSchema```). Los esquemas son objetos Joi, y la validacion funciona comparando las propiedades del objeto Joi con los campos del cuerpo de la solicitud en base al nombre. Si la validacion falla se envia un codigo de respuesta 403 (Bad Request) con una lista de los errores con la siguiente sintaxis:

```
{
  "type": "invalid-schema",
  "details": {[
    {
      "path": "username",
      "type": "must-be-string"
    },
    {
      "path": "password",
      "type": "required"
    }
  ]}
}
```

### Operaciones con archivos

+ Subir
Para subir un archivo, envialo en formato ```multipart/form-data```