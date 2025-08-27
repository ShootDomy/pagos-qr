# Documentación del Proyecto Pagos QR

Este documento describe los flujos, endpoints, funciones principales y entidades del sistema Pagos QR, desarrollado con NestJS y TypeORM.

---

## Índice

- [Módulos Principales](#módulos-principales)
- [Flujos de Usuario](#flujos-de-usuario)
- [Flujos de Transacción](#flujos-de-transacción)
- [Flujos de Cuenta](#flujos-de-cuenta)
- [Flujos de Comerciante](#flujos-de-comerciante)
- [Flujos de Notificaciones (Firebase)](#flujos-de-notificaciones-firebase)
- [Entidades y DTOs](#entidades-y-dtos)
- [Middleware](#middleware)

---

## Módulos Principales

- **Usuario**: Registro, autenticación y gestión de usuarios.
- **Cuenta**: Gestión de cuentas y saldos de usuario.
- **Transacción**: Generación y procesamiento de pagos vía QR.
- **Comerciante**: Gestión de comercios y consulta de transacciones.
- **Firebase**: Envío de notificaciones push.

---

## Flujos de Usuario

### Endpoints

- `POST /usuario/auth/registro` — Registro de usuario.
- `POST /usuario/auth/inicio` — Inicio de sesión (devuelve JWT).

### Funciones principales

- **validarCorreo**: Verifica si el correo está registrado y activo.
- **registrarUsuario**: Valida datos, encripta contraseña, crea usuario y su cuenta.
- **inicioSesionUsuario**: Valida credenciales y genera JWT.

### DTOs

- `registroUsuario`: nombre, apellido, correo, contraseña, comUuid (opcional).
- `inicioSesionUsuario`: correo, contraseña.

---

## Flujos de Transacción

### Endpoints

- `POST /transaccion/qr` — Genera código QR para pago.
- `GET /transaccion/estado` — Consulta estado de una transacción.
- `POST /transaccion/procesar` — Procesa una transacción (pago).
- `GET /transaccion/comercio` — Consulta transacciones de un comercio.

### Funciones principales

- **generarQr**: Valida monto, genera payload y QR, guarda transacción.
- **refrescarEstadoTransaccion**: Consulta y traduce estado de la transacción.
- **procesarTransaccion**: Valida existencia, estado, saldo, comerciante y procesa el pago.
- **obtenerTransaccionesComercio**: Filtra y retorna transacciones de un comercio.

### DTOs

- `generarCodigoQRDto`: traAmount, comUuid.
- `obtenerEstadoTransaccionDto`: traUuid.
- `procesarTransaccionDto`: traUuid, usuUuid, traMetodoPago, traAmount, tokenUsuario, comUuid.
- `obtenerTransaccionesComercioDto`: comUuid, cliente, estado.

---

## Flujos de Cuenta

### Endpoints

- `GET /cuenta/usuario` — Consulta cuenta y saldo de usuario.

### Funciones principales

- **generarCuenta**: Crea cuenta con saldo aleatorio para usuario.
- **validarSaldoUsuario**: Consulta saldo actual del usuario.
- **actualizarSaldoUsuario**: Actualiza saldo tras transacción.
- **obtenerCuentaXUsuario**: Retorna datos de cuenta por usuario.

### DTOs

- `obtenerCuentaUsuarioDto`: usuUuid.

---

## Flujos de Comerciante

### Endpoints

- `GET /comerciante` — Lista todos los comerciantes.

### Funciones principales

- **obtenerComerciantes**: Retorna lista de comerciantes.
- **obtenerComerciantesUuid**: Retorna datos de un comerciante por UUID.

---

## Flujos de Notificaciones (Firebase)

### Endpoints

- `POST /firebase/enviar-notificacion` — Envía notificación push.

### Funciones principales

- **enviarNotificacionPush**: Envía notificación a dispositivo vía Firebase.

### DTOs

- `enviarNotificacionDto`: token, title, message, data (opcional).

---

## Entidades y DTOs

### Entidades principales

- **Usuario**: usuUuid, usuNombre, usuApellido, usuCorreo, usuContrasena, usuActivo, comUuid, timestamps.
- **Cuenta**: cueUuid, cueNumCuenta, cueSaldo, usuUuid, timestamps.
- **Comerciante**: comUuid, comNombre, timestamps.
- **Transaccion**: traUuid, traAmount, traCurrency, traMetodoPago, traEstado, usuUuid, comUuid, traQr, traNumero, timestamps.

### Interfaces

- `IUsuarioPayload`: Datos para el JWT.
- `ITransaccionPayloadQr`: Datos para el QR.

---

## Colección Postman

Puedes descargar la colección de Postman para probar la API desde el siguiente enlace:

[Descargar colección Postman](src/postman/PagosQR.postman_collection.json)

---

## Middleware

### Middlewares implementados

- **LoggerMiddleware**: Registra en consola cada petición HTTP con método, URL y tiempo de respuesta.
- **HelmetMiddleware**: Protege la aplicación añadiendo cabeceras de seguridad HTTP estándar.
- **RateLimitMiddleware**: Limita la cantidad de peticiones por IP en un periodo de tiempo para evitar abusos.
- **CorsMiddleware**: Permite solicitudes desde otros dominios (Cross-Origin Resource Sharing), útil para APIs públicas.

---

## Flujo General del Pago QR

1. **Registro/Login**: El usuario se registra o inicia sesión y obtiene un JWT.
2. **Generación de QR**: El comercio genera un QR con monto y UUID.
3. **Escaneo y Procesamiento**: El usuario escanea el QR y procesa la transacción.
4. **Validaciones**: Se valida saldo, estado y comerciante.
5. **Actualización de Saldo**: Si la transacción es exitosa, se descuenta el saldo.
6. **Notificación**: Se envía notificación push al usuario.
7. **Consulta de Estado**: El usuario/comercio puede consultar el estado y detalle de la transacción.

---

## Seguridad

- Autenticación JWT en endpoints protegidos.
- Validación de datos con DTOs y class-validator.
- Encriptación de contraseñas con bcrypt.

---

## Observaciones

- El sistema utiliza TypeORM y PostgreSQL.
- El flujo de notificaciones requiere credenciales de Firebase.
- El sistema está modularizado y sigue buenas prácticas de NestJS.

---

## Docker

El proyecto incluye configuración para despliegue y desarrollo con Docker:

`bash
		docker-compose up --build
		`

Variables de entorno se definen en el archivo `.env`.

## Comandos Docker útiles

A continuación se detallan los comandos principales para gestionar el entorno Docker del proyecto:

- `docker-compose down -v`

  > Detiene y elimina los contenedores, redes y volúmenes definidos en docker-compose. Útil para limpiar el entorno y eliminar los datos persistentes de la base de datos. **No elimina las imágenes construidas, solo los volúmenes y contenedores.**

- `docker-compose up --build`

  > Construye las imágenes leyendo el Dockerfile y docker-compose.yml, y despliega el aplicativo (backend y base de datos). Usa este comando para iniciar el sistema desde cero o después de cambios en el código fuente.

- `docker-compose run --rm backend npm run seed`
  > Ejecuta el script de seed en el contenedor backend para poblar la base de datos con datos iniciales (crea un cliente, comerciante, cuentas, etc.). Se recomienda ejecutarlo solo una vez, cuando la base de datos está vacía o recién creada.

## Pruebas con Jest

El proyecto utiliza **Jest** para pruebas unitarias y de integración:

- Ejecuta todas las pruebas:
  ```bash
  npm run test
  ```
- Ejecuta pruebas e2e:
  ```bash
  npm run test:e2e
  ```
- Cobertura de pruebas:
  ```bash
  npm run test:cov
  ```

La configuración de Jest se encuentra en `package.json` y `test/jest-e2e.json`.

---

## Contacto

Este proyecto fue creado por **Domenica Vintimilla**.

- 📧 **Correo**: [canizaresdomenica4@gmail.com](mailto:canizaresdomenica4@gmail.com)
- 🐙 **GitHub**: [https://github.com/ShootDomy](https://github.com/ShootDomy)
- 💼 **LinkedIn**: [https://www.linkedin.com/in/domenica-vintimilla-24a735245/](https://www.linkedin.com/in/domenica-vintimilla-24a735245/)
