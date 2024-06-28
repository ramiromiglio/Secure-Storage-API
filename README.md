# Secure Storage

Un almacén seguro de archivos construido sobre Node.js y PostgreSQL

### Características:
+ Listar, subir y descargar archivos mediante REST API
+ Autenticación. El usuario debe registrarse y solo tendrá acceso a sus propios archivos
+ Es posible generar un token de autenticación de uso único para un archivo específico, permitiendo embeberlo en un link y así evitando tener que asignar la cabecera HTTP ´Authorization´ (que requiere el uso de javascript). Este link es útil para compartir con otras personas o para permitir que el navegador sea quien gestione directamente la descarga

### Requisitos

Necesitas tener Node y PostgreSQL instalado y en marcha

### Configuración

Primero clona el repositorio y accede al proyecto:
```
git clone https://github.com/ramiromiglio/secure-storage
cd secure-storage
```

Luego será necesario crear y configurar la base de datos, los comandos se encuentran en el archivo ```source/scripts/db.sql```. Puedes hacer que postgresql lo ejecute utilizando el siguiente comando:

```
psql -U postgres -a -f db.sql
```