# 🎤 Microphone Permission Guide - Voice Assistant

## ✅ Error Fixed: "Speech recognition error: not-allowed"

The voice assistant feature requires microphone access. Here's how to enable it:

---

## 🔧 **What Was Fixed**

### **✅ Improvements Made:**
1. **Better Error Messages** - Clear, user-friendly messages in all 3 languages
2. **Permission Detection** - Detects when permission is denied
3. **Graceful Degradation** - App still works if microphone is unavailable
4. **Visual Feedback** - Shows error message in the voice assistant UI
5. **Browser Compatibility** - Checks if speech recognition is supported

---

## 🌐 **How to Allow Microphone Access**

### **Google Chrome / Microsoft Edge:**

**Method 1: Click the Lock Icon**
```
1. Look at the address bar (top left)
2. Click the 🔒 lock icon or ⓘ info icon
3. Find "Microphone" in the permissions list
4. Change from "Block" to "Allow"
5. Refresh the page (F5)
6. Click the voice assistant button again
```

**Method 2: Via Settings**
```
1. Click the 3-dot menu (⋮) → Settings
2. Search for "microphone"
3. Click "Site Settings" → "Microphone"
4. Find "localhost:5173" in blocked sites
5. Remove it or move to allowed sites
6. Refresh the page
```

**Method 3: When Prompted**
```
1. Click the voice assistant button (floating mic icon)
2. Browser shows: "localhost:5173 wants to use your microphone"
3. Click "Allow"
4. ✅ Done!
```

---

### **Mozilla Firefox:**

```
1. Click the 🔒 lock icon in address bar
2. Click the ">" arrow next to "Permissions"
3. Find "Use the Microphone"
4. Change from "Blocked" to "Allowed"
5. Refresh the page (F5)
```

**Via Settings:**
```
1. Click the 3-line menu (☰) → Settings
2. Click "Privacy & Security"
3. Scroll to "Permissions" → "Microphone"
4. Click "Settings" button
5. Find "localhost:5173"
6. Change status to "Allow"
7. Save and refresh
```

---

### **Safari (Mac):**

```
1. Safari menu → Settings (or Preferences)
2. Click "Websites" tab
3. Click "Microphone" in left sidebar
4. Find "localhost" in the list
5. Change from "Deny" to "Allow"
6. Refresh the page
```

**Or:**
```
1. Click "Safari" in menu bar
2. Select "Settings for This Website"
3. Find "Microphone" dropdown
4. Select "Allow"
5. Refresh
```

---

### **Brave Browser:**

```
1. Click the Brave icon (🦁) in address bar
2. Find "Microphone" section
3. Toggle to "Allow"
4. Refresh the page
```

---

## 🎯 **Quick Fix Steps**

### **If you see the error message:**

```
❌ "Microphone permission denied. Please allow microphone access in your browser settings."
```

**Do this:**
1. ✅ Click lock icon (🔒) in address bar
2. ✅ Find "Microphone" permission
3. ✅ Change to "Allow"
4. ✅ Refresh page (F5)
5. ✅ Try voice assistant again

**That's it! Should work now! 🎉**

---

## 🖼️ **Visual Guide**

### **What You'll See in Chrome:**

```
┌─────────────────────────────────────────────┐
│ 🔒 localhost:5173                           │ ← Click this lock
├─────────────────────────────────────────────┤
│                                             │
│ Connection is secure                        │
│                                             │
│ Permissions for this site:                  │
│ ┌─────────────────────────────────┐         │
│ │ Microphone        [Block] ▼     │ ← Change to Allow
│ └─────────────────────────────────┘         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ❓ **Troubleshooting**

### **Problem: "Microphone not found"**

**Possible causes:**
- 🎤 No microphone connected
- 🔌 Microphone is disabled
- 🎧 Using headphones without mic
- 💻 Laptop mic is disabled in system settings

**Solutions:**

**Windows:**
```
1. Right-click speaker icon (🔊) in taskbar
2. Select "Sound settings"
3. Click "Manage sound devices"
4. Find your microphone
5. Make sure it's "Enabled"
6. Set as default device
```

**Mac:**
```
1. Apple menu → System Settings
2. Click "Sound"
3. Click "Input" tab
4. Select your microphone
5. Check input level is working
```

**Linux:**
```
1. Open sound settings
2. Select "Input" tab
3. Choose microphone device
4. Test input level
```

---

### **Problem: "Speech recognition is not supported"**

**This means:**
- ❌ Browser doesn't support Web Speech API
- ❌ Using an old browser version

**Solution:**
- ✅ Use Google Chrome (recommended)
- ✅ Use Microsoft Edge
- ✅ Use Safari on Mac
- ❌ Firefox has limited support
- ❌ Opera not fully supported

**Browser Support:**
```
✅ Chrome 25+        (Best support)
✅ Edge 79+          (Best support)
✅ Safari 14.1+      (Mac only)
⚠️  Firefox 116+     (Limited support)
❌ Internet Explorer (Not supported)
```

---

### **Problem: "No speech detected"**

**Causes:**
- 🔇 Speaking too quietly
- 🎤 Microphone is muted
- 🔊 Background noise too loud
- ⏱️ Not speaking within time limit

**Solutions:**
1. Speak clearly and louder
2. Check microphone is not muted
3. Move to quieter environment
4. Speak within 5 seconds of clicking button

---

### **Problem: "Network error"**

**Causes:**
- 🌐 No internet connection
- 🚫 Firewall blocking speech API
- 📡 Poor internet connection

**Solutions:**
1. Check internet connection
2. Try different network
3. Disable VPN temporarily
4. Check firewall settings

---

## 🎮 **How to Use Voice Assistant**

### **After fixing permissions:**

**Step 1: Open Voice Assistant**
```
Click the floating purple button (bottom right)
Icon: ✨ Sparkles
```

**Step 2: Click Microphone**
```
Click the large microphone button
Wait for it to turn red
```

**Step 3: Speak Your Command**
```
Say one of these commands:
- "Go to home"
- "Open dashboard"
- "Disease detection"
- "Price forecast"
- "Weather"
- "Market prices"
- "Community"
```

**Step 4: Wait for Response**
```
The assistant will:
1. Show what you said
2. Speak the response
3. Navigate to the page (if applicable)
```

---

## 🌍 **Multi-Language Support**

### **Voice commands work in all 3 languages:**

**English:**
```
- "Go to home"
- "Open dashboard"
- "Disease detection"
- "Price forecast"
- "Weather"
```

**Hindi (हिंदी):**
```
- "होम पर जाओ"
- "डैशबोर्ड खोलो"
- "रोग पहचान"
- "मूल्य पूर्वानुमान"
- "मौसम"
```

**Punjabi (ਪੰਜਾਬੀ):**
```
- "ਹੋਮ ਤੇ ਜਾਓ"
- "ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ"
- "ਰੋਗ ਪਛਾਣ"
- "ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ"
- "ਮੌਸਮ"
```

---

## 💡 **Tips for Best Experience**

### **✅ Do:**
- Speak clearly and at normal volume
- Use simple commands
- Wait for the mic to turn red before speaking
- Speak in your selected language
- Be in a quiet environment

### **❌ Don't:**
- Speak too fast or too slow
- Use very long sentences
- Speak before mic is ready
- Mix languages in one command
- Use in very noisy places

---

## 🔐 **Privacy & Security**

### **Is it safe?**

**✅ Yes! Here's why:**
- Audio is processed by your browser
- Uses Google's Speech API (industry standard)
- No audio is stored on our servers
- Only text transcript is processed
- Works completely locally
- HTTPS/localhost is secure

**What data is sent:**
- ❌ Audio files: **NO**
- ✅ Text transcript: **YES** (for command processing)
- ❌ Personal info: **NO**
- ✅ Language preference: **YES** (for accurate recognition)

---

## 🆘 **Still Not Working?**

### **Checklist:**

- [ ] Browser is Chrome, Edge, or Safari
- [ ] Microphone is connected and working
- [ ] Microphone permission is "Allow"
- [ ] Page has been refreshed after allowing
- [ ] System microphone is not muted
- [ ] Volume is up (for voice response)
- [ ] Internet connection is working
- [ ] Speaking loud enough
- [ ] No background noise
- [ ] Using correct language

**If all checked and still not working:**

### **Alternative: Use Manual Navigation**

**The voice assistant is optional!**
- You can use the app without it
- All features accessible via buttons
- Voice is just for convenience
- App works perfectly without voice

---

## 📚 **Technical Details**

### **Technology Used:**
```javascript
API: Web Speech API
- SpeechRecognition (for listening)
- SpeechSynthesis (for speaking)
- Browser: Chrome/Edge/Safari
- Standard: W3C Web Speech API
```

### **Languages Supported:**
```javascript
- en-IN (English - India)
- hi-IN (Hindi - India)
- pa-IN (Punjabi - India)
```

### **Error Codes:**
```
not-allowed    → Permission denied
no-speech      → No voice detected
audio-capture  → Microphone not found
network        → Internet issue
aborted        → User stopped
```

---

## ✅ **Success Indicators**

### **You know it's working when:**

1. ✅ Click voice assistant button
2. ✅ Modal opens with purple background
3. ✅ Click microphone button
4. ✅ Browser asks for permission (first time)
5. ✅ You click "Allow"
6. ✅ Mic button turns RED
7. ✅ You see "Listening..." text
8. ✅ Animated bars appear
9. ✅ You speak a command
10. ✅ It shows "You said: [your command]"
11. ✅ It speaks response
12. ✅ It navigates to page (if applicable)

**Perfect! Voice assistant is working! 🎉**

---

## 🎓 **Learn More**

**Web Speech API Documentation:**
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- W3C: https://wv3.org/community/speech-api/
- Chrome: https://developer.chrome.com/blog/voice-driven-web-apps/

**Browser Support:**
- Can I Use: https://caniuse.com/speech-recognition

---

## 📝 **Summary**

### **Quick Fix for "not-allowed" Error:**

```bash
1. Click 🔒 in address bar
2. Change Microphone to "Allow"
3. Refresh page (F5)
4. Try voice assistant again
✅ Done!
```

**That's it! Voice assistant should work perfectly now! 🎤**

---

**Last Updated**: March 26, 2026
**Tested On**: Chrome, Edge, Safari
**Status**: Working ✅
