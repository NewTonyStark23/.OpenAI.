# Contributing to OpenAI App Factory

First off, thank you for considering contributing to OpenAI App Factory! It's people like you that make this tool great.

---

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include:

- **Clear descriptive title**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, Node version, browser)
- **Screenshots** if applicable

### Suggesting Features

Feature suggestions are welcome! When suggesting features:

- **Use a clear descriptive title**
- **Provide a step-by-step description** of the feature
- **Explain why this feature would be useful**
- **Include mockups or examples** if possible

### Pull Requests

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

---

## 🛠️ Development Setup

### Quick Setup

```bash
# Mac/Linux
chmod +x setup.sh && ./setup.sh

# Windows
setup.bat
```

### Manual Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/openai-app-factory.git
cd openai-app-factory

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 📝 Code Style Guidelines

### TypeScript/React

- Use **TypeScript** for all new code
- Use **functional components** with hooks
- Follow **existing naming conventions**
- Keep components **small and focused**
- Use **meaningful variable names**

### Component Structure

```typescript
// Good ✅
export default function ChatPanel({ messages, onSend }: Props) {
  const [input, setInput] = useState('');
  
  // Logic here
  
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}

// Avoid ❌
export default function Chat(props) {
  // ...
}
```

### Styling

- Use **Tailwind CSS** for all styling
- Follow **mobile-first** approach
- Use **semantic class names**
- Keep **responsive design** in mind

```typescript
// Good ✅
<div className="flex items-center gap-2 p-4 bg-gray-800 rounded-lg">

// Avoid ❌
<div style={{ display: 'flex', padding: '16px' }}>
```

### State Management

- Use **local state** (`useState`) for component-specific data
- Use **context** for shared state across components
- Avoid **prop drilling** - use context or lift state up

---

## 🧪 Testing

Before submitting a PR:

```bash
# Type check
npm run typecheck

# Build for production
npm run build

# Test in browser
# Open http://localhost:5173 and test all features
```

### Manual Testing Checklist

- [ ] Chat panel works (send/receive messages)
- [ ] Preview renders generated code
- [ ] Terminal connects to backend (if enabled)
- [ ] Mind panel saves/loads memories
- [ ] Projects create and load correctly
- [ ] Templates generate projects
- [ ] Settings save properly
- [ ] Voice controls toggle
- [ ] Auth modal works (login/guest)
- [ ] All panels switch correctly
- [ ] Responsive on mobile/tablet

---

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── ChatPanel.tsx
│   ├── PreviewPanel.tsx
│   ├── MindPanel.tsx
│   └── ...
├── utils/              # Utility functions
│   └── codeGenerator.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

### Adding a New Component

1. Create file in `src/components/`
2. Use TypeScript
3. Export as default
4. Add to `App.tsx` if needed
5. Test thoroughly

```typescript
// src/components/NewPanel.tsx
interface NewPanelProps {
  // Props here
}

export default function NewPanel({ /* props */ }: NewPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Component content */}
    </div>
  );
}
```

### Adding a New Utility

1. Create file in `src/utils/`
2. Export functions
3. Import where needed
4. Add tests if applicable

```typescript
// src/utils/newHelper.ts
export function doSomething(input: string): string {
  // Implementation
}
```

---

## 🎨 Design Guidelines

### Colors

Use the existing color palette:

- **Primary:** Purple (`purple-600`)
- **Background:** Dark gray (`gray-900`, `gray-800`)
- **Text:** White/gray (`white`, `gray-300`, `gray-400`)
- **Success:** Green (`green-400`, `green-600`)
- **Error:** Red (`red-400`, `red-600`)
- **Warning:** Yellow (`yellow-400`)

### Spacing

Use Tailwind's spacing scale:

- `p-4` (16px) for standard padding
- `gap-2` (8px) for small gaps
- `gap-4` (16px) for medium gaps
- `m-6` (24px) for margins

### Typography

- **Headings:** `text-xl`, `text-2xl`, `font-bold`
- **Body:** `text-sm`, `text-gray-300`
- **Labels:** `text-xs`, `text-gray-400`

---

## 🐛 Debugging

### Common Issues

**Component not rendering:**
- Check console for errors
- Verify props are passed correctly
- Check parent component

**Styles not applying:**
- Clear browser cache
- Check Tailwind classes are correct
- Verify no CSS conflicts

**State not updating:**
- Check setState is called correctly
- Verify no stale closures
- Use React DevTools

### Browser DevTools

- **React DevTools** - Inspect component tree
- **Redux DevTools** - If using Redux
- **Network tab** - Check API calls
- **Console** - View logs and errors

---

## 📚 Resources

- **React Docs:** https://react.dev/
- **TypeScript Docs:** https://www.typescriptlang.org/
- **Tailwind CSS:** https://tailwindcss.com/
- **Vite Docs:** https://vitejs.dev/

---

## 🤝 Community

- Be respectful and inclusive
- Help others learn
- Share knowledge
- Celebrate contributions

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Recognition

Contributors will be added to the README.md hall of fame.

---

**Thank you for contributing! 🎉**
