# AI Features

SRASM leverages AI to help you build better applications and debug them faster. It provides intelligent error suggestions and a robust chat interface.

## 1. AI Error Suggestions (Slice Debugging)

Debugging state management issues can be difficult. SRASM integrates an intelligent `ErrorBoundary` that analyzes runtime errors and provides context-aware suggestions.

### How it Works

When an error occurs within a component wrapped by `SRASMProvider`:

1. The `ErrorBoundary` catches the error.
2. It captures the relevant error message and the state slice context.
3. The AI analyzes this information and returns a suggested fix or explanation in real-time.

### Usage

The `SRASMProvider` automatically enables this feature. You can enhance its accuracy by passing relevant code snippets or additional slice data.

```tsx
// App.tsx
import { SRASMProvider } from "./store";

<SRASMProvider 
  relevantCode={[
    { fileName: "Counter.tsx", code: "..." } 
  ]}
>
  <App />
</SRASMProvider>
```

When your app crashes, you will see a user-friendly error screen. The "AI Diagnosis" section will explain *why* the crash happened based on your specific state data and suggest a solution.

---

## 2. AI Chat Functionality

SRASM provides a complete chat solution, available both as a hook and a ready-to-use visual component.

### Visual Chat Component

The easiest way to add a full-featured AI chat interface to your application is by using the `SrasmChat` component. Simply add it to your router:

```tsx
import SrasmChat from './components/SrasmChat';
import { Route, Routes } from 'react-router-dom';

<Routes>
  {/* Add the chat route */}
  <Route path="/chat" element={<SrasmChat chatPath='/chat' />} />
</Routes>
```

This renders a complete chat UI that handles:
- **Message History**: Automatically saves and loads conversations.
- **Streaming**: Displays AI responses as they are typed.
- **UI/UX**: Polished interface with input handling, loading states, and auto-scrolling.

### `useChat` Hook

For custom UI implementations, you can use the underlying `useChat` hook.

```typescript
import { useChat } from "srasm/hooks";

const { messages, input, setInput, sendMessage, loading } = useChat();
```

This hook manages the state for messages, input, and AI streaming, allowing you to build your own chat interface if the default component doesn't fit your needs.
