# Bucle

Bucle es un cuaderno de hábitos para el día a día. Cada jornada muestra lo que toca hacer, se marca el cumplimiento y el calendario conserva ese registro en la fecha local. La idea es cerrar el día con un bucle corto, sin listas que desaparecen al salir de la app.

Esta entrega cubre la navegación, los hábitos por fecha y la persistencia. El temporizador y los recuerdos con foto, audio y video quedan para la etapa siguiente.

## Qué incluye

- Tres pestañas: Hoy, Calendario y Ajustes. Hoy es la pantalla inicial.
- Drawer desde el encabezado, con Inicio y Nuevo hábito.
- Stack para el detalle y el formulario de alta y edición.
- La barra inferior solo aparece en Hoy, Calendario y Ajustes.
- Hábitos con nombre, días de la semana y duración opcional.
- Cumplimiento del día, con progreso «1 de 3 completados».
- Calendario mensual. Hoy queda seleccionado al abrirlo. Las fechas futuras muestran solo la planificación.
- Apariencia Claro, Oscuro o Sistema, aplicada en toda la app.
- Hábitos, registros y apariencia guardados en AsyncStorage.
- Las fechas usan el día local del dispositivo. Un registro del lunes sigue viéndose ese lunes.

## Decisiones de desarrollo

La navegación está armada con Expo Router. El layout raíz es un Stack. Adentro, un Drawer envuelve las Tabs. El detalle (`/habito/[id]`) y el formulario (`/habito/nuevo`, `/habito/editar/[id]`) viven en el Stack, fuera de las tabs, para que la barra inferior no se muestre ahí.

El almacenamiento no se escribe al abrir la app. Primero se lee AsyncStorage y recién después se muestra la lista o el estado vacío. Así un arranque en blanco no pisa datos ya guardados.

La clave de cada registro es `YYYY-MM-DD` del calendario local. No se usa `toISOString()`, porque en Argentina (UTC-3) eso corre el día.

El logo oficial es `assets/images/bucle-logo.png` (la B de espiral, sin carita). La mascota del cuaderno está dibujada en código porque el repositorio no trae ilustraciones separadas.

## Requisitos

- Node.js 20 o superior
- npm
- Expo Go, un emulador Android o un simulador iOS

## Instalación

```bash
npm install
```

## Ejecución

```bash
npx expo start
```

Desde esa pantalla se puede abrir Expo Go, un emulador Android o un simulador iOS. La rama principal del repositorio es `master`.

## Guía de prueba

1. Abrí la app. La pestaña activa es Hoy y la fecha está en español, con el día local.
2. Si no hay hábitos para hoy, aparece la mascota y el botón **Nuevo hábito**.
3. Creá un hábito con el día de hoy marcado, por ejemplo «Leer 15 minutos» y 15 minutos.
4. En Hoy, el hábito figura como Pendiente. Tocá el casillero: pasa a Completado y el progreso dice «1 de 1 completados». Tocarlo de nuevo deshace el cumplimiento.
5. Tocá el nombre para abrir el detalle. Desde ahí se puede editar o eliminar.
6. Entrá a Calendario. El día de hoy está seleccionado y el hábito aparece con 100 % si lo completaste. Una fecha futura del mismo día de la semana muestra el hábito sin porcentaje.
7. Cerrá la app por completo y volvé a abrirla. El hábito y su cumplimiento siguen ahí.
8. En Ajustes elegí Oscuro, cerrá y volvé a abrir. El tema se mantiene. Claro y Sistema funcionan igual.
9. El menú del encabezado abre el drawer, con Inicio y Nuevo hábito. En el detalle y en el formulario no hay barra inferior.

## Estructura

```text
src/app/_layout.tsx                 Stack raíz, tema y datos
src/app/(drawer)/_layout.tsx        Drawer
src/app/(drawer)/(tabs)/            Hoy, Calendario y Ajustes
src/app/habito/                     Alta, detalle y edición
src/components/                     Tarjetas, botones, encabezado, mascota
src/state/                          Tema y hábitos
src/domain/                         Fechas, agenda y lectura de AsyncStorage
```

## Entrega del integrador

La entrega final pide el repositorio en GitHub, este README, un APK, capturas y un pitch con demo. Para generar el APK con EAS, con una cuenta de Expo ya iniciada:

```bash
npx eas-cli@latest build -p android --profile preview
```

En el pitch conviene mostrar, en este orden: crear un hábito, completarlo en Hoy, verlo en Calendario y comprobar que el tema y los datos siguen después de cerrar la app.

## Próxima etapa

- Temporizador del hábito en curso.
- Recuerdos «Para la próxima» con foto, audio y video.

## Bibliografía

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo SDK](https://docs.expo.dev/)
- [Using Fetch — Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Guide to useMemo and useCallback — Kent C. Dodds](https://kentcdodds.com/blog/usememo-and-usecallback)
