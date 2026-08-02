# 🎮 Myth Manager Project Blueprint & Architecture

**Creation Date**: 2026-08-03  
**Developer**: [wenshert-dev](https://github.com/wenshert-dev)  
**Repository**: [https://github.com/wenshert-dev/myth-manager](https://github.com/wenshert-dev/myth-manager)  

---

## 📌 Project Overview

**Myth Manager** is an original, next-generation Windows desktop utility built with **Electron**. It provides an all-in-one hub to scan game libraries, elevate process priorities, manage graphics frame-generation upscalers (DLSS Enabler, OptiScaler, Streamline, OptiPatcher, OptiBuilder), analyze DLL mod conflicts, install custom mods via drag-and-drop, and compress game installations with Compact OS technology.

---

## ⚙️ Core Technical Specifications

| Parameter | Specification |
| :--- | :--- |
| **Package Name** | `myth-manager` |
| **Product Name** | `Myth-Manager` |
| **Version** | `0.6.0` |
| **Main Process Entry** | `main.js` |
| **Framework** | Electron 29.1.0 |
| **Target OS** | Windows 10 / 11 (x64) |
| **License** | MIT License |
| **Repository** | `https://github.com/wenshert-dev/myth-manager` |
| **Packaging** | `electron-builder`, Windows NSIS x64 |
| **i18n Support** | English (Default), Turkish |

---

## 🚀 Key Modules & Architecture

1. **`src/main/index.js`**: Electron main bootstrap lifecycle & process initialization.
2. **`src/main/ipc.js`**: IPC registration hub for communication between main and renderer processes.
3. **`src/main/mods/fpsBooster.js`**: FPS booster engine managing process priority, RAM working set cleanup, and 0.5ms precision timer resolution.
4. **`src/main/mods/conflictAnalyzer.js`**: Game directory scanner detecting conflicting DirectX hook DLLs (`dxgi.dll`, `version.dll`, `nvngx.dll`) with 1-click resolution.
5. **`src/main/mods/customModInstaller.js`**: Drag-and-drop custom mod archive installer (`.zip`, `.rar`, `.7z`, `.dll`, `.asi`).
6. **`src/main/mods/turkishPatches.js`**: Verified game translation patch catalog installer.
7. **`src/main/mods/compressor.js`**: Compact OS compression engine (**XPRESS 4K/8K/16K, LZX**).

---

## 📄 Social Links

- **Discord**: [https://discord.gg/QE3zBmRhHc](https://discord.gg/QE3zBmRhHc)
- **YouTube**: [https://www.youtube.com/@wenshert](https://www.youtube.com/@wenshert)
- **GitHub**: [https://github.com/wenshert-dev/myth-manager](https://github.com/wenshert-dev/myth-manager)
