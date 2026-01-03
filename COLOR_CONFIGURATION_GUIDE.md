# 🎨 Color Configuration Guide

## 📍 **Main Color Configuration File**

### **`tailwind.config.js`** - Main Color Settings

This is the **PRIMARY** file where you define all colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',  // ← Main color (change this)
          dark: '#B91C1C',     // ← Darker shade (for hover/dark states)
          light: '#EF4444',    // ← Lighter shade (if needed)
        },
      },
    },
  },
}
```

### **How to Change Colors:**

1. **Open:** `tailwind.config.js`
2. **Find:** `colors: { primary: { ... } }`
3. **Change:** The hex color codes (`#DC2626`, `#B91C1C`, `#EF4444`)
4. **Save:** File save karo
5. **Refresh:** Browser refresh karo

---

## 🎯 **Where Colors Are Used**

### **1. Components Using Primary Color:**

- `components/Header.tsx` - Navigation, logo, buttons
- `components/Footer.tsx` - Links, accents
- `components/TopCarousel.tsx` - Background gradient
- `components/HomeWriteButton.tsx` - Banner background
- `components/FloatingWriteButton.tsx` - Floating button
- `components/WriteArticleButton.tsx` - Write button
- `components/LiveStreamBanner.tsx` - Live banner
- `components/VideoCard.tsx` - Video cards
- `components/BlogCard.tsx` - Blog cards

### **2. Pages Using Primary Color:**

- `app/page.tsx` - Homepage
- `app/videos/page.tsx` - Videos page
- `app/blogs/page.tsx` - Blogs page
- `app/admin/**/*.tsx` - Admin pages
- All other pages

---

## 🔧 **How Colors Work**

### **Color Classes Used:**

- `bg-primary` - Background color
- `text-primary` - Text color
- `border-primary` - Border color
- `bg-primary-dark` - Darker background (hover states)
- `hover:bg-primary-dark` - Hover effect
- `from-primary` / `to-primary-dark` - Gradient colors

### **Example Usage:**

```tsx
// Button with primary color
<button className="bg-primary text-white">
  Click Me
</button>

// Text with primary color
<h1 className="text-primary">Title</h1>

// Gradient background
<div className="bg-gradient-to-r from-primary to-primary-dark">
  Content
</div>
```

---

## 🎨 **Color Code Reference**

### **Current Colors:**
- **Primary:** `#DC2626` (Vibrant Red)
- **Dark:** `#B91C1C` (Darker Red)
- **Light:** `#EF4444` (Lighter Red)

### **Popular Color Options:**

#### **Red Variations:**
- `#DC2626` - Current (Vibrant Red)
- `#C41E3A` - Deep Red
- `#E63946` - Bright Red
- `#D32F2F` - Material Red

#### **Maroon/Burgundy:**
- `#800020` - Burgundy
- `#722F37` - Wine Red
- `#8B0000` - Dark Red (old brownish)

#### **Blue:**
- `#1E40AF` - Deep Blue
- `#2563EB` - Bright Blue
- `#0EA5E9` - Sky Blue

#### **Green:**
- `#059669` - Emerald
- `#16A34A` - Green
- `#15803D` - Forest Green

#### **Purple:**
- `#7C3AED` - Purple
- `#9333EA` - Violet
- `#A855F7` - Bright Purple

#### **Orange:**
- `#EA580C` - Orange
- `#F97316` - Bright Orange
- `#FF6B35` - Coral

---

## 📝 **Step-by-Step: Change Color**

### **Step 1: Choose Your Color**
- Pick a hex color code (e.g., `#1E40AF` for blue)
- Or use a color picker tool online

### **Step 2: Open `tailwind.config.js`**
```bash
# File location
tailwind.config.js
```

### **Step 3: Update Colors**
```javascript
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR_HERE',  // Main color
    dark: '#DARKER_SHADE',         // 20% darker
    light: '#LIGHTER_SHADE',       // 20% lighter
  },
}
```

### **Step 4: Calculate Dark/Light Shades**

**Dark shade:** Main color se 20% darker
- Use online tool: https://www.hexcolortool.com/
- Or manually darken the hex value

**Light shade:** Main color se 20% lighter
- Use online tool
- Or manually lighten the hex value

### **Step 5: Save & Refresh**
1. Save `tailwind.config.js`
2. Restart dev server (if running)
3. Hard refresh browser: `Ctrl + Shift + R`

---

## 🛠️ **Quick Color Tools**

### **Online Color Pickers:**
- https://htmlcolorcodes.com/
- https://coolors.co/
- https://www.hexcolortool.com/

### **Generate Color Shades:**
- https://tailwindcss.com/docs/customizing-colors
- https://javisperez.github.io/tailwindcolorshades/

---

## 📋 **Example: Change to Blue**

### **Before:**
```javascript
primary: {
  DEFAULT: '#DC2626',  // Red
  dark: '#B91C1C',
  light: '#EF4444',
}
```

### **After:**
```javascript
primary: {
  DEFAULT: '#1E40AF',  // Blue
  dark: '#1E3A8A',     // Darker blue
  light: '#3B82F6',   // Lighter blue
}
```

---

## ⚠️ **Important Notes**

1. **Only change `tailwind.config.js`** - Don't change individual component files
2. **Use hex codes** - Format: `#RRGGBB` (e.g., `#DC2626`)
3. **Restart server** - After changing config, restart `npm run dev`
4. **Hard refresh** - Browser cache clear karo (`Ctrl + Shift + R`)
5. **Test all pages** - Check header, buttons, links, etc.

---

## 🎯 **Files to Edit**

### **Main File (ONLY THIS ONE):**
```
tailwind.config.js
```

### **Don't Edit These (Auto-updated):**
- All component files (`components/*.tsx`)
- All page files (`app/**/*.tsx`)
- They use `primary` class which auto-updates

---

## ✅ **Quick Checklist**

- [ ] Open `tailwind.config.js`
- [ ] Find `primary` color section
- [ ] Change `DEFAULT` color
- [ ] Change `dark` color (20% darker)
- [ ] Change `light` color (20% lighter)
- [ ] Save file
- [ ] Restart dev server
- [ ] Hard refresh browser
- [ ] Check all pages

---

**That's it! Just change `tailwind.config.js` and all colors will update automatically! 🎨**

