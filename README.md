# Antigravity Desktop Auto-Accept (No-IDE) 🚀

> Servicio autónomo y ligero en segundo plano para auto-aprobar permisos de herramientas y preguntas (`Submit ↵`) de forma desatendida en **Antigravity Desktop App (v2.x Electron)** con soporte multiventana y protección de micrófono.

---

## ⚠️ ¿Por qué este repositorio? (Diferencia con la versión IDE)

Existen dos formas principales de usar Antigravity:

| Versión | Arquitectura | ¿Funciona este script? |
| :--- | :--- | :---: |
| **Antigravity Desktop App (v2.x)** | Aplicación independiente construida en Electron. Las extensiones convencionales de VS Code **no tienen acceso al DOM** de las conversaciones. Requiere comunicarse mediante Chrome DevTools Protocol (CDP). | ✅ **SÍ (Diseñado para esta)** |
| **Antigravity IDE (VS Code Fork)** | Entorno de desarrollo tradicional basado en VS Code. Soporta extensiones nativas del marketplace de extensiones. | ❌ **NO (Usa la extensión estándar de VS Code)** |

Este repositorio fue creado específicamente para la **versión Desktop independiente**, conectándose al puerto de depuración de Electron para interactuar directamente con la interfaz sin intervención manual.

---

## ✨ Características Principales

- **🛡️ Modo Seguro (Submit-Only):**
  - Selecciona automáticamente la Opción 1 (*"Yes, allow this time"*) y hace clic en `Submit ↵`.
  - **No** auto-acepta planes de implementación ni botones de comandos críticos (`Run` / `Proceed` / `Accept`), permitiéndote leer y validar las propuestas antes de autorizarlas.
- **🎙️ Mic-Safe (Protección contra activación de micrófono):**
  - Hace clic exclusivamente a través del árbol DOM (`element.click()`), filtrando y descartando cualquier botón con etiquetas de voz o micrófono (`Record voice memo`). No utiliza clics ciegos por coordenadas.
- **🪟 Soporte Multiventana:**
  - Si abres múltiples ventanas en Antigravity (`Ctrl + Shift + N` o diferentes proyectos), el servicio detecta cada ventana en tiempo real y ejecuta el auto-aceptar en todas en paralelo.
- **💤 100% Desatendido y Minimizado:**
  - Puedes tener Antigravity minimizado o trabajar en otras aplicaciones; el servicio continuará enviando los permisos sin perder el foco.
- **🚀 Inicio Silencioso en Windows:**
  - Incluye scripts para registrarse en el Inicio de Windows y correr en segundo plano sin abrir ventanas de consola negras molestas.

---

## 📋 Requisitos Previos

1. **Windows 10 / 11**
2. **Node.js** (versión 18 o superior) $\rightarrow$ [Descargar Node.js](https://nodejs.org/)
3. **Antigravity Desktop App** ejecutándose con el puerto de depuración habilitado (`--remote-debugging-port=9000`).

---

## ⚙️ Configuración del Acceso Directo de Antigravity (Paso Único)

Para permitir que el servicio se comunique con la aplicación de escritorio, Antigravity debe iniciarse con el puerto CDP abierto:

1. Ve a tu acceso directo de **Antigravity** (en el Escritorio o Barra de tareas).
2. Haz clic derecho $\rightarrow$ **Propiedades**.
3. En la pestaña **Acceso directo**, busca el campo **Destino**.
4. Al final de la ruta, añade un espacio y:
   ```text
   --remote-debugging-port=9000
   ```
   *Ejemplo:*
   ```text
   "C:\Users\tu-usuario\AppData\Local\Programs\Antigravity\Antigravity.exe" --remote-debugging-port=9000
   ```
5. Haz clic en **Aplicar** y **Aceptar**.
6. Cierra Antigravity por completo y vuelve a abrirlo desde ese acceso directo.

---

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
Abre una terminal (PowerShell o CMD) y ejecuta:
```bash
git clone https://github.com/arjeco/antigravity-desktop-auto-accept-no-ide.git
cd antigravity-desktop-auto-accept-no-ide
```

### 2. Instalar dependencias
```bash
npm install
```

---

## 💻 Modos de Uso

### Opción A: Ejecución normal (Para probar)
```bash
npm start
```
Verás la consola mostrando la detección de ventanas y cada clic en `Submit` realizado.

### Opción B: Inicio automático en segundo plano con Windows (Recomendado)
Para que se ejecute siempre de forma invisible al encender tu equipo:
```powershell
npm run install-startup
```
> Esto creará un acceso directo en tu carpeta de inicio (`shell:startup`) que corre el script de forma totalmente transparente mediante `wscript.exe`.

### Para desinstalar el inicio automático:
```powershell
npm run uninstall-startup
```

---

## 🪵 Registro de Logs

El servicio guarda un historial detallado de todas las acciones en:
```text
%USERPROFILE%\.antigravity\auto_accept.log
```

Para ver la actividad en tiempo real desde PowerShell:
```powershell
Get-Content "$env:USERPROFILE\.antigravity\auto_accept.log" -Wait -Tail 20
```

---

## ❓ Preguntas Frecuentes (FAQ)

#### ¿Qué pasa si abro varias ventanas de Antigravity?
El servicio escanea automáticamente todas las ventanas activas cada 1.5 segundos. Todas las ventanas abiertas tendrán el auto-aceptar activo simultáneamente.

#### ¿Por qué en una misma ventana no se auto-acepta si la conversación está en la barra lateral?
Antigravity es una aplicación SPA (Single Page Application) y solo renderiza en el DOM la conversación que tienes en pantalla. Las conversaciones en la barra lateral no tienen sus botones creados en la interfaz hasta que las abres.  
**Solución:** Si necesitas trabajar en varias conversaciones en paralelo de forma desatendida, ábrelas en ventanas separadas con **`Ctrl + Shift + N`**.

#### ¿Cómo sé si el puerto 9000 está activo?
Abre en tu navegador: [http://127.0.0.1:9000/json/list](http://127.0.0.1:9000/json/list). Deberías ver un JSON con los datos de las ventanas de Antigravity abiertas.

---

## 📄 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo [`LICENSE`](LICENSE) para más detalles.

Desarrollado y mantenido por **Arturo Cabarcas**.