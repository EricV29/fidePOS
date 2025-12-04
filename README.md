<p align="center">
  <img width="300px" src="./public/fidelogoc.png" alt="LogoFidePOS"/>
</p>

<h3 align="center">
Aplicación de escritorio de punto de venta para PyMEs. Permite gestionar ventas, inventario, ingresos y pérdidas con reportes claros y en tiempo real, ayudando a mejorar la eficiencia y el control financiero del negocio.
</h3>

---

<h2 align="center">Development technologies 🧑‍💻</h2>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,typescript,vite,electron,javascript,tailwind,sqlite" />
  </a>
</p>

<h2 align="center">Features 🛠️</h2>

<li>...</li>
<li>...</li>
<li>...</li>

<br/>

> [!IMPORTANT]
> ...

> [!WARNING]
> ...

> [!NOTE]
> ...

> [!TIP]
> ...

> [!CAUTION]
> ...

<h2 align="center">Project Setup 🚀</h2>

## 📁 Clone Repository

To use this project locally, run the following commands in your terminal:

```bash
git clone https://github.com/EricV29/fidePOS.git
cd fidePOS
npm install
```

## 🧩 Available Scripts

### 🔧 Development

Run the app in development mode (starts Vite and launches Electron):

```bash
npm run dev
```

### 🏗️ Build

Create a production package with electron-builder:

```bash
npm run build
```

### 📦 Distribution

Create a production package with electron-builder:

```bash
npm run dist
```

### 🧹 Clean

Remove all output folders (`dist` and `releases`):

```bash
npm run clean
```

### 🧩 Full Package

Clean, build, and package everything in one command:

```bash
npm run package
```

### 📁 Directory Structure

```
📁 project/
┣ 📂 electron/ -> Electron backend
┃ ┣ 📜 main.cjs
┃ ┣ 📜 preload.js
┃ ┣ 📜 intallDateManager.cjs
┃ ┗ 📂 db/
┃   ┣ 📜 database.js
┃   ┗ 📜 queries.js
┃
┣ 📂 src/ → React frontend
┃ ┣ 📜 App.tsx
┃ ┣ 📜 main.tsx
┃ ┣ 📜 index.css
┃ ┣ 📂 assets/
┃ ┣ 📂 components/
┃ ┣ 📂 hooks/
┃ ┣ 📂 lib/
┃ ┣ 📂 pages/
┃ ┗ 📂 types/
┃ ┗ 📂 utility/
┃
┣ 📦 dist/ → Vite build output
┣ 📦 releases/ → Electron Builder output (installers)
┣ 📜 package.json
┣ ⚙️ tsconfig.ts
┣ ⚙️ tailwind.config.js
┗ ⚙️ vite.config.ts
```
