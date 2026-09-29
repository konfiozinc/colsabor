# Guía del cliente — Colsabor · Comida sana

Esta guía te enseña a editar tu menú digital **sin tocar código**, usando **Pages CMS**.

## ¿Cómo edito mi menú?

1. Entra a **https://app.pagescms.org** y conéctalo a tu repositorio de GitHub (`konfiozinc/colsabor`).
2. Verás dos secciones:
   - **Productos**: la lista de platos, bebidas y jugos.
   - **Configuración**: promoción, horario, categorías y datos de contacto.

3. Edita, guarda y en **1–2 minutos** el cambio aparece en tu menú:
   **https://konfiozinc.github.io/colsabor/**

> 💡 Si no ves el cambio, recarga la página con **Ctrl + F5** (o cierra y abre la app).

---

## Productos — qué significa cada campo

| Campo | Qué poner |
|-------|-----------|
| **Nombre** | El nombre del plato. Ej: `Bandeja paisa` |
| **Categoría** | Una de: Desayunos, Almuerzos, Comidas, Jugos, Bebidas |
| **Categorías extra** | Si el plato también aparece en otra sección. Ej: un almuerzo que también es "Comidas". Normalmente déjalo vacío. |
| **Precio** | El precio en pesos. Pon `0` para mostrar "**Precio por confirmar**". |
| **Imagen** | La foto del plato (está en `assets/productos/`). |
| **Etiquetas** | Emojis de aviso que aparecen sobre la foto: `🌱` vegetariano, `🌶️` picante, `⏱️` rápido, `🔥` popular, `🏷️` recomendado. |
| **Agotado** | Actívalo para ocultar el plato del menú (sale tachado "AGOTADO"). |

## Configuración — qué significa cada campo

| Campo | Qué poner |
|-------|-----------|
| **Promoción / aviso** | El texto del banner. Ej: `🥗 PROMO DE LA SEMANA: 2x1 en Jugos` |
| **Días** | Los días que abres: `0`=Domingo, `1`=Lunes … `6`=Sábado. Ej: `1,2,3,4,5,6` = lunes a sábado. |
| **Hora de apertura / cierre** | En formato 24h. Ej: abre `7`, cierra `21` = 7 AM a 9 PM. |
| **Categorías visibles** | El orden de las secciones del menú. |
| **Teléfono** | Solo números. Ej: `3042009142` |
| **WhatsApp** | Con código de país: `57` + número. Ej: `573042009142` |
| **Ubicación / barrio** | Texto corto. Ej: `El Porvenir` |
| **Enlace público** | No lo cambies salvo que te lo indiquemos. |
| **Redes sociales** | Usuario o enlace de Instagram, Facebook y TikTok (déjalo vacío si no tienes). |

---

## Preguntas frecuentes

**¿Puedo subir fotos nuevas?**
Sí. En Pages CMS, en el campo "Imagen", usa **Subir/Upload** y la foto queda en `assets/productos/`.

**¿Cómo marco un plato como agotado por hoy?**
Abre **Productos**, busca el plato y activa **Agotado**. Guarda. En 1–2 minutos desaparece del menú (o sale tachado).

**¿Se puede editar desde el celular?**
Sí, Pages CMS funciona en el navegador del celular. Es la forma más rápida de cambiar precios o marcar agotados.

**¿Necesito pedirle esto a un programador?**
No. Todo lo que está en esta guía lo haces tú mismo desde Pages CMS.

---

*Dudas o cambios que no aparezcan aquí: escríbele a KONFÍO ZINC.*
