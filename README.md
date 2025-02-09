# Deploying a Vite App on GitHub Pages

## **1️⃣ Setup Vite Project**
If you haven’t already, create a Vite app:
```sh
npm create vite@latest my-vite-app --template react
cd my-vite-app
npm install
```

## **2️⃣ Configure `vite.config.js` for GitHub Pages**
Update `vite.config.js` to set the base path (replace `your-repo-name`):
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
});
```

## **3️⃣ Create a `.gitignore` File**
Ensure `.gitignore` includes `node_modules` and `dist`:
```
node_modules
/dist
.env
```

## **4️⃣ Build and Deploy**
Generate the production build:
```sh
npm run build
```
Then deploy the `dist` folder to GitHub Pages:
```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

## **5️⃣ Enable GitHub Pages**
1. Go to **Settings → Pages** in your repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

---

# Implementing CI/CD for GitHub Pages

## **1️⃣ Create GitHub Actions Workflow**
Create a `.github/workflows/deploy.yml` file:
```sh
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

Add the following workflow content:
```yaml
name: Deploy Vite App to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install Dependencies
        run: npm install

      - name: Build Project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: dist
```

## **2️⃣ Push and Trigger Deployment**
```sh
git add .
git commit -m "Added CI/CD pipeline"
git push origin main
```
GitHub Actions will now **automatically deploy** your app whenever you push to `main`.

---

### 🎉 **Now your Vite app is live with CI/CD on GitHub Pages!**
