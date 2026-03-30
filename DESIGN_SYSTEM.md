# SAGRI - Premium Design System Documentation

## 🎨 Design Philosophy

SAGRI's design system is inspired by premium applications like Uber, Tesla dashboards, and modern fintech apps. It combines:
- **Clean minimalism** with purposeful elements
- **Nature-inspired aesthetics** reflecting agriculture
- **High-end interactions** with smooth animations
- **Accessibility first** for farmers of all tech levels

---

## 🌈 Color Palette

### Primary Colors (Green & Earth Tones)
```css
Emerald Green
- Primary: #10b981 (emerald-500)
- Hover: #059669 (emerald-600)
- Light: #34d399 (emerald-400)

Earth & Nature
- Warm Gray: #78716c (stone-600)
- Light Stone: #fafaf9 (stone-50)
- Dark Stone: #1c1917 (stone-900)
```

### Accent Colors
```css
Golden/Amber (Highlights)
- #fbbf24 (amber-400)
- #f59e0b (amber-500)

Supporting Colors
- Sky Blue: #3b82f6 (blue-500)
- Rose: #f43f5e (rose-500)
- Purple: #a855f7 (purple-500)
```

### Semantic Colors
```css
Success: #10b981 (emerald-500)
Warning: #f59e0b (amber-500)
Error: #dc2626 (red-600)
Info: #3b82f6 (blue-500)
```

---

## 📝 Typography

### Font Stack
- **System Fonts**: Using system font stack for optimal performance
- **Weights**: 
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

### Type Scale
```css
Hero: 4rem - 7rem (text-5xl to text-7xl)
H1: 3rem - 4rem (text-4xl to text-5xl)
H2: 2rem - 3rem (text-2xl to text-4xl)
H3: 1.5rem - 2rem (text-xl to text-2xl)
Body: 1rem - 1.25rem (text-base to text-xl)
Small: 0.875rem (text-sm)
Tiny: 0.75rem (text-xs)
```

---

## 🎭 Visual Effects

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### Neumorphism (Soft UI)
- Subtle shadows with soft edges
- Layered depth using multiple shadows
- Rounded corners (16px - 24px)

### Gradients
```css
Primary Gradient: from-emerald-500 to-green-600
Warm Gradient: from-amber-500 to-orange-500
Cool Gradient: from-blue-500 to-cyan-500
Multi-color: from-purple-500 via-pink-500 to-purple-500
```

---

## 🎬 Animations

### Motion Principles
1. **Purpose-driven**: Every animation serves a purpose
2. **Smooth & Natural**: Easing functions mimic real-world physics
3. **Performance**: 60fps with GPU acceleration
4. **Subtle**: Enhance without overwhelming

### Animation Types

#### Floating Elements
```javascript
{
  y: [0, -20, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}
```

#### Hover States
```javascript
whileHover={{ scale: 1.05, y: -5 }}
whileTap={{ scale: 0.95 }}
```

#### Entrance Animations
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

#### Rotating Elements
```javascript
whileHover={{ rotate: 360 }}
transition={{ duration: 0.6 }}
```

---

## 🔲 Components

### Cards
- **Rounded corners**: 24px - 32px (rounded-2xl to rounded-3xl)
- **Shadow levels**: 
  - Base: shadow-lg
  - Hover: shadow-xl to shadow-2xl
- **Background**: White/Stone-800 with 70% opacity + backdrop blur

### Buttons
- **Primary**: Gradient background with shadow
- **Secondary**: Transparent with border
- **Sizes**: Small (py-2), Medium (py-3), Large (py-4)
- **States**: Hover scale 1.05, Active scale 0.95

### Icons
- **Size range**: 16px - 64px
- **Containers**: Rounded squares/circles with gradient backgrounds
- **Hover**: Rotate or scale effects

---

## 📐 Layout Structure

### Homepage

#### Hero Section
- Large, bold typography
- Animated gradient backgrounds
- Floating decorative elements
- Weather widget with live data
- Crop recommendations preview
- Clear CTAs with animation

#### Market Prices
- Card-based layout
- Real-time price updates
- Trend indicators (up/down)
- Hover interactions

#### Quick Actions
- Grid of gradient cards
- Icon + label format
- Touch-friendly (min 48px)

#### Features Grid
- 3-column layout (responsive)
- Animated cards with icons
- Hover lift effect

#### Testimonials
- 3-column cards
- Star ratings
- Farmer photos/avatars
- Quote styling

### Dashboard

#### Welcome Banner
- Full-width gradient card
- Personalized greeting
- Time-based messages
- Stats overview
- Floating animations

#### Farm Overview
- 4-column stat cards
- Icon + number + label
- Color-coded by category
- Hover scale effect

#### Weather Widget
- Large feature card
- Animated weather icons
- Temperature chart
- 3 quick stats (humidity, wind, rain)

#### Alerts Section
- Vertical stack
- Color-coded by priority
- Icon indicators
- Time stamps
- Hover slide effect

#### Analytics Sections
- Soil health with progress bars
- Market trends with line charts
- Crop distribution pie chart
- Responsive containers

#### Task Manager
- Checkbox list
- Priority badges
- Time indicators
- Completion states

#### Quick Actions Grid
- 4-column responsive grid
- Feature cards with gradients
- Icon animations on hover
- Navigation links

#### Recent Activity
- Timeline-style list
- Icon + description
- Results display
- Hover highlight

---

## 🎯 UX Patterns

### Mobile-First Approach
- Touch targets: minimum 48x48px
- Readable text: minimum 16px
- Thumb-friendly navigation
- Collapsible sections

### Loading States
- Skeleton screens
- Smooth transitions
- Progress indicators
- Optimistic updates

### Micro-interactions
- Button feedback (scale on press)
- Card hover effects (lift & shadow)
- Icon animations (rotate, pulse)
- Progress animations

---

## 🌍 Accessibility

### Color Contrast
- WCAG AA compliance
- Text contrast ratio: 4.5:1 minimum
- Large text: 3:1 minimum

### Interactive Elements
- Clear focus states
- Keyboard navigation support
- Screen reader friendly
- Touch-friendly sizes

### Motion
- Respects prefers-reduced-motion
- Optional animation toggle
- Meaningful animations only

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Grid Patterns
- Mobile: 1-2 columns
- Tablet: 2-3 columns
- Desktop: 3-4 columns
- Large: 4-6 columns

---

## 🎨 Special Effects

### Floating Background Blobs
- Large blur circles
- Animated position
- Gradient colors
- Low opacity (10-20%)
- Infinite animation loop

### Gradient Animations
- Rotating gradients
- Shimmer effects
- Color transitions
- Background position shifts

### Custom Scrollbar
- Emerald gradient
- Rounded design
- Hover states
- Dark mode support

---

## 💡 Best Practices

1. **Performance**
   - Use CSS transforms for animations
   - Lazy load images
   - Optimize SVGs
   - Minimize repaints

2. **Consistency**
   - Reuse component patterns
   - Follow spacing scale (4px, 8px, 16px, 24px, 32px)
   - Maintain color hierarchy
   - Standard animation durations

3. **User Experience**
   - Clear visual hierarchy
   - Immediate feedback
   - Logical flow
   - Minimal cognitive load

4. **Dark Mode**
   - Automatic detection
   - Toggle available
   - Adjusted contrasts
   - Semantic color mapping

---

## 🚀 Animation Performance Tips

1. Use `transform` and `opacity` for animations
2. Apply `will-change` sparingly
3. Use GPU-accelerated properties
4. Limit simultaneous animations
5. Use `requestAnimationFrame` for JS animations

---

## 📊 Data Visualization

### Charts (Recharts)
- **Line Charts**: Market trends, weather forecasts
- **Area Charts**: Temperature, humidity over time
- **Bar Charts**: Comparative data
- **Pie Charts**: Crop distribution, resource allocation

### Chart Styling
- Emerald/green color scheme
- Smooth curves
- Animated entrances
- Tooltips with glassmorphism
- Responsive sizing

---

## ✨ Signature Elements

1. **Gradient Cards**: Colorful backgrounds for CTAs
2. **Floating Animations**: Subtle movement for visual interest
3. **Glassmorphism**: Modern, premium feel
4. **Icon Containers**: Rounded squares with gradients
5. **Progress Indicators**: Animated bars and circles
6. **Weather Icons**: Animated based on conditions
7. **Hover Effects**: Consistent scale + shadow pattern

---

This design system ensures a consistent, premium, and delightful user experience throughout the SAGRI platform!
