# 🚀 Myth Manager

<p align="center">
  <img src="program_logo.png" alt="Myth Manager Logo" width="140" height="140" />
</p>

<p align="center">
  <b>The Next-Generation Windows Game Library Optimizer, FPS Booster & Mod Manager</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%2010%2F11-blue?style=for-the-badge&logo=windows" alt="Windows 10/11" />
  <img src="https://img.shields.io/badge/Framework-Electron%2029-purple?style=for-the-badge&logo=electron" alt="Electron 29" />
  <img src="https://img.shields.io/badge/Developer-wenshert--dev-purple?style=for-the-badge&logo=github" alt="Developer" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <a href="https://youtube.com/@wenshert">
    <img src="https://img.shields.io/badge/YouTube-@wenshert-red?style=for-the-badge&logo=youtube" alt="YouTube Channel" />
  </a>
  <a href="https://discord.gg/QE3zBmRhHc">
    <img src="https://img.shields.io/badge/Discord-Join%20Community-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord Community" />
  </a>
</p>

---

## 🌟 Overview

**Myth Manager** is a high-performance Windows desktop application created by **[wenshert-dev](https://github.com/wenshert-dev)** designed to revolutionize game management, frame generation modding, process prioritization, and disk storage optimization.

---

## ⚡ Core Features

* 🚀 **Myth FPS Booster & System Tuner**: 1-click RAM working set cleaner, process priority manager (`HIGH`), and 0.5ms precision system timer resolution manager.
* 🔍 **Smart Mod & DLL Conflict Analyzer**: Scans game directories for overlapping DirectX hook DLLs (`dxgi.dll`, `version.dll`, `d3d11.dll`, `nvngx.dll`) with 1-click automatic resolution.
* ⚡ **Drag & Drop Custom Mod Installer**: Drop any `.zip`, `.rar`, `.7z`, `.dll`, `.asi`, or `.ini` file into Myth Manager to instantly deploy mods to target games.
* 🇹🇷 **Game Translation Patches Catalog**: 1-click installer for 100% verified game translations.
* 🎮 **Multi-Platform Scanner**: Automatically discovers games across **Steam**, **Epic Games**, **GOG Galaxy**, **Xbox App**, **EA App**, and **Ubisoft Connect**.
* 🧙 **Smart Injection Wizards**: Step-by-step interactive wizards for **DLSS Enabler**, **OptiScaler**, and **OptiBuilder** upscalers.
* 💾 **Compact OS Compression Engine**: Compress game installations using **XPRESS 4K/8K/16K** and **LZX** algorithms to save tens of gigabytes of SSD space without performance penalties.
* 🎁 **Free Games Radar**: Real-time tracking of giveaways and free game claim links via GamePower Free API.

---

## 🛠️ Mod Integration Matrix

| Component | Description | Integration Level |
| :--- | :--- | :--- |
| **DLSS Enabler** | Enables Multi-Frame Generation on non-RTX GPUs | Auto installer, interactive wizard, rollback & INI editor |
| **OptiScaler** | Open-source upscaler bridge (DLSS / FSR3 / XeSS) | Automated GitHub release fetching & extraction |
| **OptiBuilder** | Custom mod builder wrapper | Automated release builder and wizard installer |
| **Streamline SDK** | NVIDIA Streamline wrapper libraries | Deep BFS DLL search, hash verification & backup restore |

---

## 💻 Developer Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- Windows 10/11 64-bit

### Installation & Run

```bash
# 1. Clone Repository
git clone https://github.com/wenshert-dev/myth-manager.git
cd myth-manager

# 2. Install Dependencies
npm install

# 3. Launch Development Server
npm start

# 4. Package Windows Installer (.exe)
cmd.exe /c "npx electron-builder --win --x64 -c.win.signAndEditExecutable=false --publish never"
```

---

## 📄 License & Community

Designed & Developed by **[wenshert-dev](https://github.com/wenshert-dev)**.

- 💬 **Discord Community**: [https://discord.gg/QE3zBmRhHc](https://discord.gg/QE3zBmRhHc)
- 📺 **YouTube Channel**: [https://www.youtube.com/@wenshert](https://www.youtube.com/@wenshert)
- 🐙 **GitHub Repository**: [https://github.com/wenshert-dev/myth-manager](https://github.com/wenshert-dev/myth-manager)
