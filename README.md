# Secure Storage

Un almacén seguro de archivos construido sobre Node y PostgreSQL. Permite listar, subir y descargar archivos mediante REST API. El usuario debe registrarse y solo tendrá acceso a sus propios archivos, además es posible generar un token de autenticación de uso único para un archivo específico, permitiendo embeberlo en un link y así evitando tener que asignar la cabecera HTTP ´Authorization´ (que requiere el uso de javascript). Este link es útil para compartir con otras personas o para permitir que el navegador sea quien gestione directamente la descarga.

### Requisitos

Es necesario tener instalado Node y postgresql en marcha

### Configuración

Clona el repositorio y accede al proyecto:
```
git clone https://github.com/ramiromiglio/secure-storage
cd secure-storage
```

Instala los modulos de Node
```
npm install
```

Configurar la base de datos:
```
psql -U YOUR_POSTGRES_USERNAME -a -f source/scripts/db.sql
```

Despliega el servidor:
```
npm start
```