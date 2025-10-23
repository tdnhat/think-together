# 🎨 Frontend Style Guide — Quiz Platform

## 🧭 Design Direction
> **Goal:** Create a friendly, engaging interface for students that feels modern and approachable — clean minimal layout with fun neo-brutalist touches (bold borders, shadows, vibrant accents).

---

## 🌈 Color Palette

| Role | Color | Usage |
|------|--------|--------|
| Primary | `#00A8E8` | Buttons, active states |
| Secondary | `#FFE066` | Highlights, hover accents |
| Background | `#FFFFFF` | Page background |
| Surface | `#F8FAFC` | Cards, modals |
| Border | `#00171F` | Element outlines |
| Text Primary | `#003459` | Headings, titles |
| Text Secondary | `#334155` | Paragraphs, hints |
| Success | `#22C55E` | Correct answers, success toast |
| Error | `#EF4444` | Wrong answers, error toast |

> Keep high contrast and avoid pure black backgrounds — the mood should feel bright and optimistic ☀️

---

## 🧩 Components Style

### 🪄 Card
```tsx
<div className="bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] transition-transform">
  <h3 className="text-2xl font-bold mb-2 text-[#003459]">Quiz Title</h3>
  <p className="text-[#334155] text-base">A quick quiz to test your skills.</p>
</div>
```

### 🔘 Button
```tsx
<button className="border-2 border-black bg-[#FFE066] text-black font-semibold px-5 py-2 rounded-lg shadow-[4px_4px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform">
  Start Quiz
</button>
```

### 📦 Input / Field
```tsx
<input
  type="text"
  placeholder="Enter your name"
  className="border-2 border-black rounded-lg px-4 py-2 shadow-[3px_3px_0_#000] focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
/>
```

---

## 🖋 Typography

| Element | Font | Size | Weight |
|----------|------|------|--------|
| Heading 1 | Raleway | 2.5rem | 700 |
| Heading 2 | Raleway | 2rem | 600 |
| Body text | Be Vietnam Pro | 1rem | 400 |
| Button text | Quicksand | 1rem | 600 |
| Caption | Be Vietnam Pro | 0.875rem | 400 |

> **Tip:** `Raleway` for clean, academic headings + `Be Vietnam Pro` for readable Vietnamese text + `Quicksand` for friendly buttons.  

---

## 🪞 Layout Rules
- Use **max width ~1200px** for centered layout  
- Keep **consistent padding** (`p-6` or `p-8`)  
- Maintain **white space** — don’t cram too much on one screen  
- Group related info in **cards or sections** with visible borders/shadows  
- Avoid gradient overload — 90% flat colors  

---

## 💫 Animations
- Use **snappy micro-interactions** (hover scale, shadow lift)  
- Example:
```tsx
transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]
```
- Use playful transitions for quiz progress or score reveal (like confetti or bounce)

---

## 🧠 UX Tone
- Friendly & energetic  
- Use emojis or icons occasionally 🧩✨  
- Clear feedback: show correct/incorrect states visually  
- Use encouraging messages like “Nice one!” or “Almost there!”  

---

## 📱 Responsive
- Mobile first  
- Collapse card grids → vertical stack  
- Increase button size & spacing for touch targets  
- Font scaling:  
  - `text-xl` on desktop  
  - `text-lg` on tablet  
  - `text-base` on mobile  