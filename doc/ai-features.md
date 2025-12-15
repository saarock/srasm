# AI Features

SRASM isn't just a state management library; it's designed with AI integration at its core. It provides powerful tools for building AI interfaces and leverages AI to help you debug your application.

## 1. AI Error Suggestions (Slice Debugging)

Debugging state management issues can be tricky. SRASM integrates an intelligent `ErrorBoundary` that works with a Web Worker to analyze runtime errors and provide context-aware suggestions.

### How it Works

When an error occurs within a component wrapped by `SRASMProvider`:

1. The `ErrorBoundary` catches the error.
2. It captures the relevant slice state and component code.
3. It spins up a dedicated `ErrorWorker` (Web Worker) to avoid blocking the main thread.
4. The worker sends the error context to an AI model (configured in your app).
5. The AI analyzes the error in the context of your specific state slice and returns a suggested fix or explanation.

### Usage

The `SRASMProvider` automatically sets this up. You can enhance its effectiveness by providing `relevantCode` and `additionalSlices`.

```tsx
// App.tsx
import { SRASMProvider } from "./store";

// Optimally, you can pass source code snippets to help the AI understand context
const relevantCode = [
  {
    fileName: "Counter.tsx",
    code: "...", // string content of the file
  },
];

<SRASMProvider relevantCode={relevantCode}>
  <App />
</SRASMProvider>
```

When an error crashes the app, you will see an enhanced error screen with an "AI Suggestion" section explaining *why* the crash happened based on your specific state data.

---

## 2. AI Chat (`useChat`)

SRASM includes a production-ready `useChat` hook designed for building robust AI chat interfaces. It handles efficient state updates, streaming responses, and persistence.

### Features

- **Streaming Support**: Handles token-by-token streaming updates for a real-time "typing" feel.
- **Persistence**: Automatically saves chat history to `IndexDB`, ensuring conversations aren't lost on refresh.
- **Pagination**: Efficiently loads older messages as you scroll.
- **State Management**: Manages loading states, user input, and message history.

### API: `useChat()`

```typescript
import { useChat } from "srasm/hooks";

function ChatComponent() {
  const {
    messages,       // Array of ChatMessage objects
    input,          // Current input text
    setInput,       // Update input text
    sendMessage,    // Function to send message to AI
    currentAiText,  // Real-time streaming text (the chunk being typed)
    loading,        // Boolean loading state
    setChatId,      // Switch between different conversation threads
    deleteChat,     // Delete a conversation
  } = useChat();

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {/* Render the streaming text separately while loading */}
        {loading && <div className="message agent retrieving">{currentAiText}</div>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
```

### Persistence (IndexDB)

The hook uses a singleton `IndexDB` utility class to manage local storage.
- **`saveMessage(chatId, messages)`**: Stores the updated conversation.
- **`getMessages(chatId, limit)`**: Retrieves paginated messages.
- **`deleteChat(chatId)`**: Removes a conversation history.

This ensures your chat application is offline-capable and preserves user context across sessions.
