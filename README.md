# Node.js Secure Storage API

Esta es una API RESTful para el almacenamiento seguro de archivos en una base de datos PostgreSQL utilizando Express. Utiliza autenticacion con JWT y permite generar links de descarga de unico uso. Fue creada con propositos de aprendizaje y para que sirva como punto de partida a la hora de crear una CRUD API.

+ Operaciones basicas permitidas: subir, listar, descargar y eliminar
+ Cada usuario solo tiene acceso a sus propios archivos
+ Es posible solicitar un token de un solo uso para descargar un archivo resguardado unicamente a partir de un link

### Configuracion

Clona el repositorio, accede al proyecto e instala los modulos de Node
```
git clone https://github.com/ramiromiglio/secure-storage
cd secure-storage
npm install
```

Configura la base de datos (requiere PostgreSQL instalado en tu sistema):
```
psql -U YOUR_POSTGRES_USERNAME -a -f source/scripts/db.sql
```

Despliega el servidor en el puerto 8004:
```
npm start
```

### Autenticacion

Antes de poder subir un archivo es necesario registrarse pasando pasando los campos ```username``` y ```password``` al endpoint ```/api/auth/signup``` en formato ```x-www-form-urlencoded```.

Exito:


Fallo:
```
TYPE /auth/username-conflict  STATUS_CODE 409
TYPE /internal-server         STATUS_CODE 500
```

En caso de exito, la respuesta c

TYPE /auth/username-not-found STATUS_CODE 404
TYPE /auth/invalid-password   STATUS_CODE 401


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

### Requisitos

Es necesario tener instalado Node y postgresql en marcha

### Configuración

