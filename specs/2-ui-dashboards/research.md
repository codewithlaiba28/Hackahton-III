# Research & Technical Decisions: LearnFlow UI Dashboards

**Created**: 2026-03-02
**Purpose**: Document technical decisions for UI implementation

---

## Decision 1: Monaco Editor Integration

**Context**: Students need a professional code editor experience similar to VS Code.

### Decision
Use `@monaco-editor/react` v4 with SSR disabled in Next.js 14.

### Rationale
- **Official Wrapper**: Maintained by Monaco team, always up-to-date
- **VS Code Experience**: Same editor as VS Code, familiar to developers
- **Python Support**: Excellent syntax highlighting, IntelliSense
- **Performance**: Lazy loading, web worker for tokenization

### Implementation Pattern
```typescript
// Dynamic import with SSR disabled
import dynamic from 'next/dynamic'

const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
)

// Usage
<Editor
  height="400px"
  language="python"
  theme="vs-dark"
  value={code}
  onChange={handleChange}
/>
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| CodeMirror 6 | Smaller bundle, flexible | Less VS Code-like, setup complex | Monaco more authentic |
| Ace Editor | Lightweight | Outdated, poor TypeScript | Monaco better DX |
| Custom iframe | Full control | Complex, security concerns | Monaco safer, easier |

---

## Decision 2: State Management

**Context**: UI needs global state for user auth, mastery data, and real-time updates.

### Decision
React Context for auth + Zustand for application state.

### Rationale
- **Simple**: Minimal boilerplate, easy to understand
- **Scalable**: Can add slices as app grows
- **DevTools**: Built-in Zustand devtools
- **Performance**: No unnecessary re-renders

### Implementation Pattern
```typescript
// stores/masteryStore.ts
import { create } from 'zustand'

interface MasteryState {
  modules: ModuleProgress[]
  updateMastery: (moduleId: string, score: number) => void
}

export const useMasteryStore = create<MasteryState>((set) => ({
  modules: [],
  updateMastery: (moduleId, score) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId ? { ...m, score } : m
      ),
    })),
}))
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Redux Toolkit | Powerful, devtools | Boilerplate, overkill | Zustand simpler |
| Jotai | Atomic, flexible | Less familiar, smaller community | Zustand more mature |
| Recoil | Atomic, React-native | Experimental, Facebook-only | Zustand stable |

---

## Decision 3: Charting Library

**Context**: Progress visualization needs line charts, radial progress, and heatmaps.

### Decision
Recharts for all charts and graphs.

### Rationale
- **React-Native**: Composable components, declarative API
- **TypeScript**: Excellent type definitions
- **Customizable**: Full control over styling
- **Bundle Size**: ~150KB gzipped (acceptable)

### Implementation Pattern
```typescript
// ProgressRing.tsx
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width={120} height={120}>
  <RadialBarChart data={[{ value: masteryScore }]}>
    <RadialBar
      dataKey="value"
      cornerRadius={10}
      fill={getColorForScore(masteryScore)}
    />
  </RadialBarChart>
</ResponsiveContainer>
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Chart.js | Popular, simple | Less React-friendly API | Recharts more composable |
| D3 | Most powerful | Steep learning curve, verbose | Overkill for our needs |
| Victory | React-native, modular | Smaller community | Recharts more popular |

---

## Decision 4: Animation Strategy

**Context**: UI needs subtle, performance-safe animations per constitution.

### Decision
CSS transitions for simple animations + Framer Motion for complex sequences.

### Rationale
- **CSS**: Zero bundle size, GPU-accelerated
- **Framer Motion**: Declarative, respects prefers-reduced-motion
- **Performance**: 60fps guaranteed with proper usage
- **Accessibility**: Auto-respects user preferences

### Implementation Pattern
```typescript
// CSS for simple hover
.button {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  box-shadow: 0 0 20px rgba(0, 200, 150, 0.2);
}

// Framer Motion for complex
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  <MasteryCard />
</motion.div>
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| GSAP | Most powerful, timeline | 70KB bundle, overkill | Framer Motion sufficient |
| Pure CSS | Zero bundle | Limited control, no sequences | Need JS for complex |
| React Spring | Physics-based | Complex API, larger bundle | Framer simpler |

---

## Decision 5: Responsive Design Approach

**Context**: UI must scale from 1366px laptop to 3840px 4K monitor.

### Decision
CSS Grid + Flexbox with container queries (progressive enhancement).

### Rationale
- **Modern**: Container queries are future of responsive design
- **Component-First**: Components adapt to container, not viewport
- **Fallback**: Grid/Flexbox works everywhere
- **Performance**: No JavaScript required

### Implementation Pattern
```css
/* Container query setup */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Container query (progressive) */
@container (min-width: 700px) {
  .learning-workspace {
    grid-template-columns: 1fr 1fr;
  }
}
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Tailwind CSS | Fast development, utility-first | Generic look, bundle size | Custom CSS more control |
| Bootstrap | Quick setup, components | Too generic, heavy | Doesn't match AI-native aesthetic |
| Media Queries | Universal support | Viewport-focused, not component | Container queries better |

---

## Decision 6: Design Token System

**Context**: Constitution defines specific colors, animations, spacing.

### Decision
CSS custom properties (CSS variables) in tokens.css file.

### Rationale
- **Native**: No build step required
- **Dynamic**: Can change at runtime (theme switching later)
- **DevTools**: Easy to inspect and debug
- **Performance**: Zero runtime cost

### Implementation Pattern
```css
/* tokens.css */
:root {
  /* Colors */
  --bg-primary: #0B1220;
  --bg-surface: #111827;
  --accent-primary: #00C896;
  
  /* Animations */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
}
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
| ----------- | ---- | ---- | ------------ |
| Styled System | Type-safe, composable | Build step, dependency | CSS variables simpler |
| Theme UI | React-focused, MDX | Extra dependency | Native CSS sufficient |
| Sass Variables | Familiar, powerful | No runtime changes | CSS variables more flexible |

---

## Summary of Technology Choices

| Layer | Technology | Version | Purpose |
| ----- | ---------- | ------- | ------- |
| Editor | Monaco Editor | 4.x | Code editing experience |
| State | Zustand | 4.x | Global state management |
| Charts | Recharts | 2.x | Progress visualization |
| Animations | Framer Motion | 10.x | Complex animations |
| Styling | CSS Custom Props | Native | Design tokens |
| Layout | CSS Grid + Flexbox | Native | Responsive design |

---

## Next Steps

1. ✅ Research complete - all technical decisions documented
2. Proceed to component-model.md with component definitions
3. Generate component API contracts
4. Create quickstart.md with development setup
