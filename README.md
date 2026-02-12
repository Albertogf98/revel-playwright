## Requisitos Previos

Antes de instalar Playwright, asegúrate de tener:

- **Node.js** (versión 18 o superior recomendada)
- **npm** (viene con Node) o **yarn**
- Acceso a terminal (bash, zsh, PowerShell, etc.)

### Verifica las versiones

```bash
node -v
npm -v
```

## Cómo empezar la configuración inicial:

Lo primero por razones de seguridad no se ha compartido en el repositorio el fichero .env.prod, por eso se lo he eviado a Beatriz por correo, ese fichero va en la raíz del proyecto
revel-playwright/env/.env.prod

Después para ejecutarlo en tu local tendrás que guardar la variable de entorno prod, para eso tendrás que ejecutar un comando en función de la máquina que tengas:

- OS || Linux:

```bash
export NODE_ENV=prod
```

- Windows || Shellbash:

```bash
$env:NODE_ENV="prod"
```

La idea de esto es la siguiente: normalmente tenemos varios entorno dev, uat, pre y prod, ni las URL´s ni los datos como API cuadran en ninguno de los entornos, entonces la idea es elegirlo antes de ejecutar, esto mejora la acoplabilidad del proyecto y además le sumamos una capa para el caso que se quiera ejecutar en una pipeline ya configurada.

## Guía de Ejecución de Pruebas con Playwright

Existen varias formas de ejecutar los tests. La más recomendada es dejarla configurada en el `package.json` para usar `npm test`, pero Playwright ofrece flexibilidad total desde la terminal.

Si necesitas más control específico usa:

- npx playwright test,Suite completa: Ejecuta todos los tests en todos los navegadores configurados.
- npx playwright test --grep @TAG,Por Tags: Ejecuta solo los tests etiquetados. Nota: Los tags se definen en la carpeta constants.
- npx playwright test --ui,Modo Gráfico: Abre la interfaz de usuario para ver la ejecución paso a paso.
- npx playwright test --grep @TAG --project=chrome,Filtrado Mixto: Ejecuta un tag específico solo en el navegador Chrome.
- npx playwright test --workers=1,Control de Workers: Ejecuta la suite con un número específico de hilos en paralelo.

## Consideraciones de Automatización y Casos de Prueba

Antes de detallar los casos de prueba automatizados (Flujo sin filtros, con filtros y reseteo), es fundamental destacar dos puntos críticos sobre la infraestructura y el desarrollo actual:

---

#### Gestión del Login y Captcha:

En esta suite **no se ha automatizado el flujo de Login** debido a la presencia de **Captcha**, el cual, por diseño, está hecho para bloquear la automatización.

- **El Problema:** El uso de Captcha impide el flujo de trabajo de herramientas como Playwright.
- **La Solución Propuesta:** Para automatizar este paso en el futuro, se debería:
    - Habilitar un **entorno de pruebas** con el Captcha desactivado.
    - Para el **OTP_CODE**: Consumir una API _mockeada_ que devuelva el código de forma dinámica, evitando así la dependencia de códigos estáticos o que caducan.

#### Robustez de Localizadores (Flaky Tests)

A excepción de las **Cookies**, que poseen IDs únicos, el resto de los localizadores utilizados para los filtros presentan un riesgo alto de generar **Flaky Tests** (tests inestables).

#### ¿Por qué sucede esto?

El Front-End (FE) no ha sido diseñado siguiendo la filosofía de **"Design for Testability"**. Cuando los componentes no tienen identificadores claros, los tests dependen de selectores frágiles (como clases CSS dinámicas o jerarquías DOM) que cambian con cualquier actualización visual.

#### Buenas Prácticas Sugeridas

Para garantizar un entorno de pruebas robusto y escalable, es vital que durante el desarrollo de componentes se incluyan atributos específicos para testing:

- Uso de `data-testid="nombre-del-componente"`
- Uso de `id` únicos.
- Uso de `aria-label` descriptivos.

> [!IMPORTANT]
> Implementar estos identificadores permite crear localizadores resistentes a cambios en el diseño y elimina la fragilidad de la suite de pruebas.

### Casos de Prueba Automatizados

1.  **Flujo sin filtros:** Verificación del listado base.
2.  **Flujo con dos filtros:** Validación de la precisión de búsqueda.
3.  **Reseteo de filtros:** Verificación de la limpieza del estado de la búsqueda.

## Suite de Regresión

Para implementar una suite de regresión sólida y escalable, el enfoque se centrará en la segmentación inteligente y la integración con herramientas de gestión.

### Estrategia de Ejecución (Tags)

La suite de regresión se gestionará mediante **Tags**. Esto nos permite ejecutar una cobertura total o parcial de forma quirúrgica:

- **Cobertura Total:** Inclusión de todas las casuísticas posibles del sistema.
- **Casos de Borde (Edge Cases):** Automatización de escenarios críticos de UX, por ejemplo:
    - **Estado de Carga:** ¿Qué ocurre si se interactúa con un botón mientras la app está cargando? (Validación de _Skeletons_).
    - **Bloqueo de UI:** Asegurar que el Grid no se cierre o no permita acciones inconsistentes hasta que la carga de datos sea completa.

### Integración y Reportabilidad (Jira / TestRail)

Para que la automatización aporte valor real al negocio, la ejecución debe estar conectada con nuestras herramientas de gestión de pruebas:

1.  **Llamadas a APIs:** Implementación de _hooks_ que se disparen al finalizar los tests.
2.  **Sincronización Automática:** Los resultados se reportarán directamente en los **Test Plans** de Jira o TestRail.
3.  **Visibilidad:** Cada ejecución de la "Auto" actualizará el estado del ticket correspondiente, permitiendo un seguimiento en tiempo real del estado de salud del proyecto.

> [!NOTE]
> Esta integración permite que el equipo de QA y Stakeholders tengan una visión clara del éxito de la regresión sin necesidad de acceder al código o a la consola de ejecución.

## Integración en CI/CD

Para llevar la automatización al siguiente nivel en un entorno de Integración y Despliegue Continuo (CI/CD), la infraestructura debe ser segura, aislada y reproducible.

### Gestión Segura de Secretos (HashiCorp Vault)

En entornos profesionales, **prescindiremos de los archivos `.env`**, ya que suponen un riesgo de seguridad si se gestionan mal.

- **Uso de Vault:** Almacenaremos credenciales, tokens y claves de acceso en un almacén de secretos como **Vault**.
- **Inyección Dinámica:** Durante la ejecución del Pipeline, los secretos se inyectan directamente en las variables de entorno de los contenedores, sin dejar rastro en el código fuente.

### Entornos Reproducibles con Docker

Para evitar el clásico "en mi máquina funciona", habría que utilizar **Dockers** para estandarizar el entorno de ejecución:

1.  **Levantamiento del Entorno:** Un contenedor Docker contendrá todas las dependencias necesarias (navegadores de Playwright, Node.js, librerías del sistema).
2.  **Aislamiento Total:** Cada ejecución de CI se realiza en un contenedor limpio, garantizando que no existan restos de ejecuciones previas que puedan corromper los resultados.
3.  **Escalabilidad:** Docker facilita la ejecución en paralelo en la nube (GitHub Actions, GitLab CI, Jenkins), permitiendo levantar múltiples contenedores simultáneamente para reducir el tiempo total de la suite.

> [!TIP]
> **Estrategia Recomendada:** Configurar un pipeline que, tras cada _Merge Request_, levante el contenedor, descargue los secretos de Vault, ejecute la suite de regresión y destruya el entorno al finalizar, enviando el reporte automáticamente a Jira.
