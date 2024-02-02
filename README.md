# Prueba tecnica - Backend gateway POS
## Instalacion de dependencias
Ejecutar el comando `npm install`

## Levantar la aplicacion
La aplicacion usa redis como BD para guardar el token generado y los datos encriptados. Se recomienda tener instalado docker y ejecutar el comando `npm run serve:full` que crea un contenedor redis y seguidamente levanta la aplicacion.

## Compilacion de la aplicacion
Ejecutar el comando `npm run build`

## Ejecucion de los tests
Ejecutar el comando `npm run test`

## Prueba del cluster EKS
### Ejecucion del endpoint POST /token/generateToken

http://af6d5ef3a78034a2692d567671693cb1-1796551486.us-east-1.elb.amazonaws.com:8080/token/generateToken

### Ejecucion del endpoint GET /card/data

http://af6d5ef3a78034a2692d567671693cb1-1796551486.us-east-1.elb.amazonaws.com:8080/card/data

Para poder probar los servicios puede utilizar la [coleccion postman](https://github.com/CarlosLlaque/prueba-culqi/blob/master/Prueba%20tecnica%20Culqi.postman_collection.json)
