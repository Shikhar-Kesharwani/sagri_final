# 🚀 VS Code Setup & Run SAGRI Project - Complete Guide

## 📋 **Complete Step-by-Step Guide for Beginners**

This guide will help you:
1. ✅ Install all required software
2. ✅ Download your code from GitHub
3. ✅ Open and run in VS Code
4. ✅ Deploy to production

**Estimated Time:** 30-45 minutes (first time)

---

## 📥 **STEP 1: Install Required Software**

You need to install these (in order):

### **1.1 Install Git**

**Check if already installed:**
```bash
git --version
```

**If you see a version number:** ✅ Skip to 1.2

**If NOT installed:**

**Windows:**
1. Go to: https://git-scm.com/download/win
2. Click "Click here to download"
3. Run the installer
4. **Important:** Use these settings:
   - ✅ Use Visual Studio Code as Git's default editor
   - ✅ Git from the command line and also from 3rd-party software
   - ✅ Use the OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use MinTTY
   - ✅ Default (fast-forward or merge)
   - ✅ Git Credential Manager
   - ✅ Enable file system caching
5. Click "Next" → "Next" → "Install"
6. Click "Finish"
7. **Restart your computer**

**Mac:**
```bash
# Open Terminal and run:
xcode-select --install
```

**Linux:**
```bash
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install git

# Fedora:
sudo dnf install git
```

**Verify installation:**
```bash
git --version
# Should show: git version 2.x.x
```

✅ **Git installed!**

---

### **1.2 Install Node.js (REQUIRED for React)**

**Check if already installed:**
```bash
node --version
npm --version
```

**If you see version numbers:** ✅ Skip to 1.3

**If NOT installed:**

**All Platforms (Windows/Mac/Linux):**

1. **Go to:** https://nodejs.org/
2. **Download:** LTS version (recommended for most users)
   - Should be version 20.x.x or higher
   - Example: "20.11.0 LTS"
3. **Run the installer**
4. **Important settings:**
   - ✅ Automatically install necessary tools
   - ✅ Add to PATH (should be checked by default)
5. Click "Next" → "Next" → "Install"
6. Wait for installation (5-10 minutes)
7. Click "Finish"
8. **Restart your computer**

**Verify installation:**

Open a new terminal/command prompt:

```bash
node --version
# Should show: v20.11.0 (or similar)

npm --version
# Should show: 10.2.4 (or similar)
```

✅ **Node.js and npm installed!**

---

### **1.3 Install Visual Studio Code**

**Check if already installed:**
- Look for VS Code in your applications

**If NOT installed:**

**All Platforms:**

1. **Go to:** https://code.visualstudio.com/
2. **Click:** "Download for Windows/Mac/Linux"
3. **Run the installer**
4. **Important settings:**
   - ✅ Add "Open with Code" action to Windows Explorer file context menu
   - ✅ Add "Open with Code" action to Windows Explorer directory context menu
   - ✅ Register Code as an editor for supported file types
   - ✅ Add to PATH (important!)
5. Click "Next" → "Next" → "Install"
6. Click "Finish"
7. **VS Code will open**

✅ **VS Code installed!**

---

### **1.4 Install VS Code Extensions (Recommended)**

**Open VS Code and install these extensions:**

**How to install extensions:**
1. Click the Extensions icon (left sidebar) or press `Ctrl+Shift+X`
2. Search for extension name
3. Click "Install"

**Required Extensions:**
1. **ESLint** - JavaScript linting
2. **Prettier - Code formatter** - Auto-format code
3. **ES7+ React/Redux/React-Native snippets** - React shortcuts
4. **Auto Rename Tag** - Auto rename HTML/JSX tags
5. **Path Intellisense** - Auto-complete file paths

**Optional but Helpful:**
6. **GitLens** - Enhanced Git features
7. **Thunder Client** - Test APIs
8. **Tailwind CSS IntelliSense** - Tailwind auto-complete
9. **Error Lens** - Show errors inline
10. **Material Icon Theme** - Better file icons

**How to install all at once:**

Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac), then paste:
```
ext install dbaeumer.vscode-eslint esbenp.prettier-vscode dsznajder.es7-react-js-snippets formulahendry.auto-rename-tag christian-kohler.path-intellisense
```

✅ **Extensions installed!**

---

## 📥 **STEP 2: Download Your Code from GitHub**

### **2.1 Create a Projects Folder**

**Windows:**
```bash
# Open Command Prompt or PowerShell
cd C:\
mkdir Projects
cd Projects
```

**Mac/Linux:**
```bash
# Open Terminal
cd ~
mkdir Projects
cd Projects
```

**Or create manually:**
- Create a folder named `Projects` in your Documents or C:\ drive

---

### **2.2 Clone Your Repository**

**Open Terminal/Command Prompt in the Projects folder:**

**Method 1 - Via Terminal:**
```bash
# Navigate to Projects folder
cd C:\Projects
# or on Mac/Linux: cd ~/Projects

# Clone your repository (REPLACE YOUR-USERNAME!)
git clone https://github.com/YOUR-USERNAME/sagri-platform.git

# Navigate into the project
cd sagri-platform
```

**Method 2 - Via VS Code:**
1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type: "Git: Clone"
4. Enter: `https://github.com/YOUR-USERNAME/sagri-platform.git`
5. Choose location: `C:\Projects` (or `~/Projects`)
6. Click "Open" when prompted

**IMPORTANT:** Replace `YOUR-USERNAME` with your actual GitHub username!

**Example:**
```bash
git clone https://github.com/rajesh-kumar/sagri-platform.git
```

**You should see:**
```
Cloning into 'sagri-platform'...
remote: Enumerating objects: 150, done.
remote: Counting objects: 100% (150/150), done.
remote: Compressing objects: 100% (100/100), done.
Receiving objects: 100% (150/150), 2.50 MiB | 1.20 MiB/s, done.
Resolving deltas: 100% (45/45), done.
```

✅ **Code downloaded!**

---

## 🔧 **STEP 3: Open Project in VS Code**

### **3.1 Open the Project**

**Method 1 - From Terminal:**
```bash
cd sagri-platform
code .
```

**Method 2 - From VS Code:**
1. Open VS Code
2. Click "File" → "Open Folder"
3. Navigate to `C:\Projects\sagri-platform`
4. Click "Select Folder"

**Method 3 - From File Explorer:**
1. Navigate to `C:\Projects\sagri-platform` in File Explorer
2. Right-click in the folder (not on a file)
3. Click "Open with Code"

**VS Code should now show your project!**

✅ **Project opened in VS Code!**

---

### **3.2 Trust the Workspace**

**If VS Code asks "Do you trust the authors?":**
- Click **"Yes, I trust the authors"**

This is your own code, so it's safe! ✅

---

## 📦 **STEP 4: Install Project Dependencies**

### **4.1 Open Terminal in VS Code**

**Press:** `Ctrl+`` (backtick key, usually below Escape)

**Or:** Menu → Terminal → New Terminal

**You should see a terminal at the bottom of VS Code.**

---

### **4.2 Install Dependencies**

**In the terminal, run:**

```bash
npm install
```

**Alternative (if npm is slow):**
```bash
# Use pnpm (faster)
npm install -g pnpm
pnpm install
```

**What happens:**
- Downloads all required packages
- Installs React, Tailwind, Recharts, etc.
- Creates `node_modules` folder
- Takes 2-5 minutes (depending on internet speed)

**You should see:**
```
npm WARN deprecated ...
added 1234 packages, and audited 1235 packages in 2m

150 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**Common warnings (safe to ignore):**
- `npm WARN deprecated` - Just warnings, not errors
- `npm fund` - Optional, not required

✅ **Dependencies installed!**

---

## 🚀 **STEP 5: Run the Development Server**

### **5.1 Start the Server**

**In the terminal, run:**

```bash
npm run dev
```

**Alternative commands (try if above doesn't work):**
```bash
npm start
# or
npm run start
# or
pnpm dev
```

**You should see:**
```
> sagri-platform@1.0.0 dev
> vite

  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Server is running!**

---

### **5.2 Open in Browser**

**Automatically:**
- Your browser should open automatically to `http://localhost:5173/`

**Manually:**
1. Open your web browser (Chrome, Edge, Firefox)
2. Go to: `http://localhost:5173/`
3. **Alternative ports:** Try `http://localhost:3000/` or `http://localhost:5174/`

**You should see your SAGRI platform!** 🎉

---

### **5.3 Development Mode**

**Now you can:**
- ✅ Edit code in VS Code
- ✅ Changes auto-reload in browser (Hot Module Replacement)
- ✅ See errors in terminal and browser console
- ✅ Test all features locally

**To stop the server:**
- Press `Ctrl+C` in the terminal
- Type `Y` if asked to confirm

---

## 🔍 **STEP 6: Understanding the Project Structure**

### **6.1 Project Folders**

```
sagri-platform/
├── src/                      # Source code
│   ├── app/                  # Main application
│   │   ├── App.tsx          # Main component ⭐
│   │   ├── routes.ts        # React Router config
│   │   └── components/      # React components
│   ├── styles/              # CSS files
│   │   ├── theme.css        # Tailwind theme
│   │   └── fonts.css        # Font imports
│   └── imports/             # Figma imports (images/SVGs)
├── supabase/                # Backend code
│   └── functions/
│       └── server/          # Server-side code
├── public/                  # Static files
├── node_modules/            # Dependencies (auto-generated)
├── package.json             # Project config ⭐
└── index.html               # Entry point
```

**Key Files:**
- **`/src/app/App.tsx`** - Main React component (edit this!)
- **`/package.json`** - Dependencies and scripts
- **`/src/styles/theme.css`** - Design system

---

### **6.2 Important Commands**

**Run development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Install new package:**
```bash
npm install package-name
```

**Update dependencies:**
```bash
npm update
```

---

## ✏️ **STEP 7: Making Changes**

### **7.1 Edit Code**

**Example: Change the app title**

1. **Open:** `/src/app/App.tsx`
2. **Find:** Line with app title
3. **Change:** Text to whatever you want
4. **Save:** `Ctrl+S`
5. **Check browser:** Should auto-reload with changes! ✅

---

### **7.2 Auto-Format Code (Prettier)**

**Install Prettier:**
```bash
npm install --save-dev prettier
```

**Create config file `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

**Format on save:**
1. `Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"
2. Add:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**Manual format:**
- Press `Shift+Alt+F` (Windows/Linux)
- Press `Shift+Option+F` (Mac)

---

### **7.3 Common Shortcuts**

**VS Code shortcuts:**
```
Ctrl+S              Save file
Ctrl+P              Quick file search
Ctrl+Shift+P        Command palette
Ctrl+`              Toggle terminal
Ctrl+B              Toggle sidebar
Ctrl+/              Comment/uncomment line
Ctrl+D              Select next occurrence
Alt+Up/Down         Move line up/down
Shift+Alt+Up/Down   Duplicate line
Ctrl+Space          Trigger autocomplete
F2                  Rename symbol
```

---

## 🐛 **STEP 8: Troubleshooting**

### **Issue 1: "npm: command not found"**

**Fix:**
```bash
# Reinstall Node.js from https://nodejs.org/
# Restart computer
# Open new terminal
node --version
npm --version
```

---

### **Issue 2: "Cannot find module"**

**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### **Issue 3: "Port 5173 already in use"**

**Fix:**
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port:
npm run dev -- --port 3000
```

---

### **Issue 4: "Permission denied"**

**Fix (Windows):**
```bash
# Run as Administrator
# Right-click PowerShell → Run as Administrator
```

**Fix (Mac/Linux):**
```bash
# Don't use sudo with npm!
# Fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to ~/.bashrc or ~/.zshrc:
export PATH=~/.npm-global/bin:$PATH
```

---

### **Issue 5: Build errors**

**Fix:**
```bash
# Clear cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version (should be 18+)
node --version
```

---

## 📤 **STEP 9: Deploy to Production**

### **9.1 Build for Production**

```bash
npm run build
```

**This creates:**
- `dist/` folder with optimized files
- Ready for deployment

---

### **9.2 Deploy to Vercel (Recommended)**

**Why Vercel:**
- ✅ Free for personal projects
- ✅ Automatic deployments from GitHub
- ✅ Custom domain support
- ✅ Lightning fast CDN
- ✅ Perfect for React apps

**Steps:**

**1. Create Vercel account:**
- Go to: https://vercel.com/signup
- Click "Continue with GitHub"
- Authorize Vercel

**2. Import your repository:**
- Click "Add New" → "Project"
- Select "Import Git Repository"
- Choose `sagri-platform`
- Click "Import"

**3. Configure project:**
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**4. Add environment variables (if needed):**
```
SUPABASE_URL=your-url-here
SUPABASE_ANON_KEY=your-key-here
```

**5. Click "Deploy"**

**Wait 2-3 minutes...**

**Your app is live!** 🎉

**You'll get a URL like:**
```
https://sagri-platform.vercel.app
```

**Share this link with anyone!**

---

### **9.3 Deploy to Netlify (Alternative)**

**Why Netlify:**
- ✅ Free for personal projects
- ✅ Easy drag-and-drop deployment
- ✅ Automatic HTTPS
- ✅ Form handling
- ✅ Serverless functions

**Steps:**

**1. Create Netlify account:**
- Go to: https://app.netlify.com/signup
- Click "Sign up with GitHub"
- Authorize Netlify

**2. Deploy from GitHub:**
- Click "Add new site" → "Import an existing project"
- Click "GitHub"
- Select `sagri-platform`
- Configure:
```
Build command: npm run build
Publish directory: dist
```
- Click "Deploy site"

**3. Your site is live!**
```
https://sagri-platform.netlify.app
```

---

### **9.4 Continuous Deployment**

**Once connected to Vercel/Netlify:**

**Automatic deployment workflow:**
```
1. Edit code in VS Code
2. Save changes
3. Commit: git add . && git commit -m "Updated feature"
4. Push: git push
5. Vercel/Netlify auto-deploys! ✅
6. Live site updates in 2-3 minutes
```

**No manual deployment needed!**

---

## 📋 **STEP 10: Complete Checklist**

### **Software Installation:**
- [ ] Git installed (`git --version`)
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] VS Code installed
- [ ] VS Code extensions installed

### **Project Setup:**
- [ ] Code cloned from GitHub
- [ ] Project opened in VS Code
- [ ] Dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] Can see app in browser

### **Development:**
- [ ] Can edit code
- [ ] Changes auto-reload
- [ ] No errors in terminal
- [ ] Understand project structure

### **Deployment:**
- [ ] Production build works (`npm run build`)
- [ ] Deployed to Vercel or Netlify
- [ ] Live URL accessible
- [ ] Auto-deployment configured

**All checked? You're a pro developer! 🎊**

---

## 🎯 **Quick Reference Commands**

### **Daily Development Workflow:**

```bash
# 1. Open project in VS Code
cd C:\Projects\sagri-platform
code .

# 2. Start development server
npm run dev

# 3. Make changes in VS Code
# Files auto-save, browser auto-reloads

# 4. When ready, commit changes
git add .
git commit -m "Description of changes"
git push

# 5. Vercel/Netlify auto-deploys!
```

---

## 🎓 **Learning Resources**

### **React:**
- Official Docs: https://react.dev/
- Tutorial: https://react.dev/learn

### **Tailwind CSS:**
- Docs: https://tailwindcss.com/docs
- Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet

### **VS Code:**
- Docs: https://code.visualstudio.com/docs
- Shortcuts: https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf

### **Git:**
- Interactive Tutorial: https://learngitbranching.js.org/
- Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf

### **JavaScript/TypeScript:**
- JavaScript: https://javascript.info/
- TypeScript: https://www.typescriptlang.org/docs/

---

## 🆘 **Getting Help**

### **If you're stuck:**

**Check console errors:**
```
Browser: F12 → Console tab
VS Code: Terminal tab
```

**Search for errors:**
- Google: "react error message here"
- Stack Overflow: https://stackoverflow.com/
- ChatGPT: Paste error message

**Common fixes:**
```bash
# Most issues fixed by:
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## ✅ **Summary**

### **You now know how to:**
1. ✅ Install all required software
2. ✅ Clone project from GitHub
3. ✅ Open and run in VS Code
4. ✅ Install dependencies
5. ✅ Run development server
6. ✅ Edit code and see live changes
7. ✅ Build for production
8. ✅ Deploy to Vercel/Netlify
9. ✅ Auto-deploy on every push

**You're ready to build amazing apps! 🚀**

---

**Created:** March 27, 2026
**For:** SAGRI Smart Agriculture Platform
**Difficulty:** Beginner Friendly
**Estimated Time:** 30-45 minutes (first time setup)
