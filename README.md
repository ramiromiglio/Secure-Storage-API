# Node.js Secure Storage API

Esta es una API RESTful para el almacenamiento seguro de archivos en una base de datos PostgreSQL utilizando Express. Utiliza autenticacion con JWT y permite generar links de descarga de unico uso. Fue creada con propositos de aprendizaje y para que sirva como punto de partida a la hora de crear una CRUD API.

+ Operaciones basicas permitidas: subir, listar, descargar y eliminar
+ Cada usuario solo tiene acceso a sus propios archivos
+ Es posible solicitar un token de un solo uso para descargar un archivo resguardado unicamente a partir de un link

### Configuracion

Clona el repositorio y accede al proyecto
```
git clone https://github.com/ramiromiglio/secure-storage
cd secure-storage
```

Instala los modulos de Node
```
npm install
```

Una vez instalados los modulos es necesario crear la base de datos y sus respectivas tablas. Los comandos para esto se encuentran en el archivo ```source/scripts/db.sql```. Teniendo PostgreSQL instalado en tu sistema, puedes utilizar el siguiente comando:
```
psql -U YOUR_POSTGRES_USERNAME -a -f source/scripts/db.sql
```

Finalmente despliega el servidor:
```
npm start
```

El puerto por defecto es el 8004, pero puedes elegir otro cambiando ```DB_PORT``` en el archivo ```.env```.

### Autenticacion

Antes de poder subir un archivo es necesario registrarse pasando pasando los campos ```username``` y ```password``` al endpoint ```/api/auth/signup``` en formato ```x-www-form-urlencoded``` con metodo HTTP ```POST```. En caso de exito la respuesta contendra un JWT que sera necesario para autenticar al usuario en llamadas posteriores a la API, como tambien el ```username```.

Una respuesta exitosa podria verse tal que asi:
```
{
  "user": "ramiromiglio",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRt2MDY3fQ.KvZjZAp2CvIl_2dWzCozLvLUNjvUQXbCdyXMZBBsq2k"
}
```

> [!NOTE]
> Es posible obtener la misma respuesta llamando al endpoint ```/api/auth/signin``` luego de un registro exitoso.

### Subir, listar, descargar y eliminar

### Validacion de la solicitud

La validacion del cuerpo de las solicitudes las realiza el middleware schema-validator. Para obtener una instancia del middleware es necesario llamar a ```schemaValidator``` pasando como argumento un identificador de esquema previamente registrado con ```defineSchema```. Los esquemas son objetos Joi y la validacion funciona comparando las propiedades del objeto Joi con los campos del cuerpo de la solicitud en base al nombre. Si la validacion falla se envia un codigo de respuesta 403 (Bad Request) con una lista de los errores con la siguiente sintaxis:

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