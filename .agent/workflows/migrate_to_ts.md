---
description: Migrate all projects to TypeScript
---
# TypeScript Migration Workflow

This workflow automates the installation of dependencies and file renaming for the migration.

## 1. Install Global Dependencies (Optional but helpful)
Ensure you have a recent node version.

## 2. Artizana Backend Migration

### Install Dependencies
// turbo
```bash
cd artizana-backend
npm install -D typescript @types/node @types/express @types/mongoose @types/cors @types/passport @types/jsonwebtoken @types/bcryptjs @types/express-session @types/passport-google-oauth20 @types/multer
```

### Create tsconfig.json
```bash
cd artizana-backend
npx tsc --init --target es2016 --module commonjs --outDir ./dist --strict true --esModuleInterop true
```

### Rename Files
// turbo
```powershell
Get-ChildItem -Path "artizana-backend/src" -Recurse -Filter "*.js" | Rename-Item -NewName { $_.Name -replace '\.js$','.ts' }
Rename-Item "artizana-backend/server.js" "artizana-backend/server.ts"
```

## 3. Artizana Mobile Migration

### Install Dependencies
// turbo
```bash
cd artizana-mobile
npm install -D typescript @types/react @types/react-native
```

### Rename Files (PowerShell)
// turbo
```powershell
Write-Host "Renaming files in artizana-mobile..."
Get-ChildItem -Path "artizana-mobile" -Recurse -Filter "*.js" | ForEach-Object {
    $newName = $_.Name -replace '\.js$','.tsx'
    Rename-Item -Path $_.FullName -NewName $newName
}
# Rename known non-component files back to .ts if strictness is desired, or keep as .tsx (valid for all)
```

## 4. Artizana Web Migration

### Install Dependencies
// turbo
```bash
cd artizana-web
npm install -D typescript @types/node @types/react @types/react-dom @types/jest
```

### Rename Files
// turbo
```powershell
Get-ChildItem -Path "artizana-web/src" -Recurse -Filter "*.js" | Rename-Item -NewName { $_.Name -replace '\.js$','.tsx' }
```
