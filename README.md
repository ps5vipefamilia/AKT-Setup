# AKT · App de setup para el equipo (v1.1)

PWA para Android · CRG KT2 + Iame X30 · 3 parejas piloto/mecánico · sincronización en tiempo real con Firebase · acceso restringido a miembros aprobados.

## Archivos (súbelos todos a GitHub)

| Archivo | Qué es | Cambia en v1.1 |
|---|---|---|
| `index.html` | La app completa (HTML + estilos + lógica) | Sí: login con Google, solicitud/aprobación de acceso |
| `firebase-config.js` | Datos de tu proyecto Firebase (rellenar) | No |
| `firestore.rules` | Reglas de seguridad (pegar en la consola, no las usa la web) | Sí: reescritas |
| `manifest.json` | Hace que Android la instale como app | No |
| `sw.js` | Caché para funcionar sin cobertura | Sí (versión de caché) |
| `icon-192.png`, `icon-512.png` | Iconos | No |
| `README.md` | Esta guía | Sí |

## Modelo de seguridad

- **Nadie accede sin cuenta de Google.** No hay acceso anónimo.
- **Iniciar sesión no da acceso a nada.** Los datos solo los leen y escriben los usuarios que el administrador ha aprobado. El código de equipo solo sirve para dirigir la solicitud al equipo correcto.
- **Los permisos se comprueban en las reglas de Firestore**, no en la app: admin (todo), "editar todos los karts", o editar solo el kart asignado. Aunque alguien modificara la web, la base de datos rechaza lo que no le corresponde.
- **El admin aprueba y expulsa** desde Más → Usuarios y permisos. Al expulsar, la persona pierde el acceso al instante.
- **La configuración web de Firebase es pública por diseño** (va en `firebase-config.js`, visible en el repositorio). No es un secreto: sin pasar login y reglas no sirve para nada. Aun así, se restringe la API key al dominio de la app (paso D).
- **No hay contraseñas, PINs ni datos sensibles** almacenados.
- **Riesgo aceptado (no resuelto):** no se ha activado Firebase App Check. Con cuentas reales y reglas por miembro, su aportación aquí es marginal (protege contra abuso de cuota desde scripts). Se puede añadir más adelante.

## Puesta en marcha

### A. Firebase (base de datos y login) · ~10 min

**A1. Crear el proyecto**
1. https://console.firebase.google.com → **Crear un proyecto** → nombre `akt-karting` → Continuar.
2. Google Analytics: desactivar → **Crear proyecto** → Continuar.

**A2. Activar el acceso con Google**
1. Menú izquierdo → **Compilación → Authentication → Comenzar**.
2. Pestaña **Sign-in method** → **Google** → interruptor **Habilitar**.
3. Nombre público del proyecto: `AKT` · Correo de asistencia: el tuyo → **Guardar**.
4. **No** actives "Anónimo".

**A3. Crear la base de datos**
1. **Compilación → Firestore Database → Crear base de datos**.
2. Ubicación **eur3 (europe-west)** → Siguiente → **Modo de producción** → Crear.

**A4. Pegar las reglas de seguridad (imprescindible)**
1. Firestore → pestaña **Reglas** → borrar todo el editor.
2. Abrir `firestore.rules` con el Bloc de notas, copiar todo, pegar → **Publicar**.
3. Comprueba que arriba no aparece ningún error en rojo.

**A5. Registrar la app web y copiar la configuración**
1. ⚙️ (junto a "Descripción general del proyecto") → **Configuración del proyecto** → bajar a **Tus apps** → icono **`</>`**.
2. Sobrenombre `AKT` · no marcar Hosting → **Registrar app**.
3. Copiar los valores del bloque `firebaseConfig` en `firebase-config.js` (sustituir cada valor entre comillas; los nombres de campo son los mismos). Guardar. Comprobar que el archivo no se ha guardado como `.txt`.

### B. GitHub Pages (publicar la app) · ~5 min

1. https://github.com → **+** → **New repository** → nombre `akt-app` → **Public** → marcar *Add a README file* → **Create repository**.
2. **Add file → Upload files** → arrastrar los 8 archivos de la carpeta (el `README.md` sobrescribe el de GitHub) → **Commit changes**.
3. **Settings → Pages** → *Build and deployment* → Source **Deploy from a branch** → Branch **main** / **/(root)** → **Save**.
4. En 1–2 min aparece la URL: `https://TU-USUARIO.github.io/akt-app/`.
5. **Firebase → Authentication → Settings → Authorized domains → Add domain** → `TU-USUARIO.github.io`.

Si GitHub te avisa de "secret detected" por la API key: es la config pública de Firebase, no un secreto. Haz el paso D y cierra la alerta como *"Used in tests / Won't fix"* **después**, no antes.

### C. Google Cloud: restringir la API key · ~3 min

1. https://console.cloud.google.com → arriba, seleccionar el proyecto `akt-karting`.
2. Menú ☰ → **APIs y servicios → Credenciales**.
3. En *Claves de API*, pulsar **Browser key (auto created by Firebase)**.
4. *Restricciones de aplicaciones* → **Sitios web** → **Agregar** → `TU-USUARIO.github.io/*` y también `TU-USUARIO.github.io`.
5. *Restricciones de API* → **Restringir clave** → marcar solo: **Identity Toolkit API**, **Token Service API**, **Cloud Firestore API** → **Guardar**.
6. Espera 5 minutos y comprueba que la app sigue entrando. Si deja de funcionar, vuelve y añade la API que falte.

### D. Móviles Android · ~2 min cada uno

1. Chrome → `https://TU-USUARIO.github.io/akt-app/`.
2. Menú ⋮ → **Añadir a pantalla de inicio** / **Instalar aplicación**.
3. Abrir AKT → **Entrar con Google** → elegir cuenta.
4. **Tú primero**: nombre, rol, código (p. ej. `AKT`) → **Crear equipo nuevo con este código**. Quedas como admin.
5. **Los demás**: mismo código → **Solicitar acceso**. Ven "Solicitud enviada" hasta que apruebes.
6. **Tú**: en Inicio aparece el aviso de solicitudes → Aprobar → asignar kart a cada uno.

### E. Primera configuración (admin)

1. **Más → Karts y pilotos**: piloto, mecánico y nº de chasis de cada kart.
2. **Motores**: "+ Añadir motor" por kart (serie + apodo) → Editar para poner horas actuales de pistón y biela.
3. **Más → Ajustes**: intervalos (10 h pistón / 25 h biela), RPM objetivo (15.500), circunferencia de rueda (0,88 m; mídela).
4. **Más → Circuitos**: corregir relaciones de referencia con vuestros datos.

## Actualizar la app en el futuro
GitHub → repositorio → **Add file → Upload files** → arrastrar solo los archivos que cambien → Commit. En 1–2 minutos los móviles cargan la versión nueva (cerrar y abrir la app).

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| "Falta configurar firebase-config.js" | Valores de ejemplo sin sustituir, o archivo guardado como `.txt` |
| `auth/unauthorized-domain` al entrar con Google | Falta el dominio en Authorized domains (B5) |
| `auth/operation-not-allowed` | Proveedor Google no habilitado (A2) |
| `permission-denied` / "Sin permiso" | Reglas no publicadas (A4), o el usuario no está aprobado / sin kart asignado |
| No se puede crear equipo: "probablemente ya existe" | Ese código ya está en uso: pide acceso o usa otro código |
| Entra pero no ve datos | Está aprobado pero las reglas antiguas siguen publicadas: repetir A4 |
| Pantalla en blanco en Android | Hacer captura y pasarla; comprobar en el PC con F12 → Console |

## Estructura de datos (Firestore)

```
teams/{CODIGO}
  ├─ nombre, code, adminUid, config{pistonH, bielaH, rpmObjetivo, circunf}
  ├─ users/{uid}       nombre, rol, email, kartId, canEditAll, isAdmin   ← miembros aprobados
  ├─ requests/{uid}    nombre, rol, email                                 ← pendientes de aprobar
  ├─ karts/{id}        nombre, piloto, mecanico, chasisSerie
  ├─ motores/{id}      kartId, serie, apodo, horas, pistonHoras, pistonFecha, bielaHoras, bielaFecha, activo
  ├─ circuitos/{id}    nombre, longitud, pinonRef, coronaRef, notas
  ├─ sesiones/{id}     kartId, motorId, circuitoId, fecha, tipo, cond{}, setup{}, carb{}, trans{}, result{}, horas, comentarios
  └─ setups/{id}       nombre, kartId, circuitoId, setup{}, carb{}, trans{}, mejorVueltaMs
```

## Siguientes fases
- **Fase 2**: modo entreno con comparativa de setups, diagnóstico por síntoma (coach), notificaciones push de mantenimiento.
- **Fase 3**: importación de telemetría (CSV de Race Studio 3 / Alfano).
