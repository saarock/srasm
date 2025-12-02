import type { ChatMessage } from "../types";

export class IndexDB {
  private dataBaseName: string = "SRASM_DATABASE";
  private dataBaseVersion: number = 1;
  private dataBase: IDBDatabase | null = null;
  private static instance: IndexDB | null = null;
  private initPromise: Promise<void> | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.initPromise = this.initDataBase();
  }

  // Initialize the database
  private async initDataBase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject("IndexedDB is not supported in this browser");
        return;
      }

      const request = window.indexedDB.open(
        this.dataBaseName,
        this.dataBaseVersion
      );

      request.onsuccess = (event) => {
        this.dataBase = (event.target as IDBOpenDBRequest).result;
        console.log("Database connected successfully");
        resolve();
      };

      request.onerror = (event) => {
        console.error("Database error:", (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("chats")) {
          db.createObjectStore("chats", { keyPath: "chatId" });
          console.log("Object store created");
        }
      };

      request.onblocked = () => {
        console.warn(
          "Database connection blocked. Please close other tabs with this site open."
        );
        reject("Database connection blocked.");
      };
    });
  }

  // Ensure database is initialized before use
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.initPromise) {
      this.initPromise = this.initDataBase();
    }
    await this.initPromise;
    if (!this.dataBase) {
      throw new Error("Database initialization failed");
    }
    return this.dataBase;
  }

  // Create a new chat session with a unique chatId
  public async createNewChat(chatName: string): Promise<string> {
    try {
      const db = await this.ensureDB();
      const chatId = this.generateChatId(chatName);

      return new Promise((resolve, reject) => {
        const transaction = db.transaction("chats", "readwrite");
        const store = transaction.objectStore("chats");

        const chatData = { chatId, name: chatName, messages: [] };
        const request = store.add(chatData);

        request.onsuccess = () => {
          console.log("New chat created successfully");
          resolve(chatId);
        };

        request.onerror = (event) => {
          console.error(
            "Error creating new chat:",
            (event.target as IDBRequest).error
          );
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("Failed to create chat:", error);
      return "";
    }
  }

  // Delete a chat by chatId
  public async deleteChat(chatId: string): Promise<void> {
    try {
      const db = await this.ensureDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("chats", "readwrite");
        const store = transaction.objectStore("chats");
        const request = store.delete(chatId);

        request.onsuccess = () => {
          console.log("Chat deleted successfully");
          resolve();
        };

        request.onerror = (event) => {
          console.error(
            "Error deleting chat:",
            (event.target as IDBRequest).error
          );
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    }
  }

  // Save a message in the specific chat
  public async saveMessage(
    chatId: string,
    messages: ChatMessage[]
  ): Promise<void> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction("chats", "readwrite");
        const store = transaction.objectStore("chats");

        const request = store.get(chatId);

        request.onsuccess = () => {
          const chat = request.result;
          if (chat) {
            // Replace the entire message history
            chat.messages = messages;
            const updateRequest = store.put(chat);

            updateRequest.onsuccess = () => {
              console.log("Messages saved successfully");
              resolve();
            };

            updateRequest.onerror = (event) => {
              reject((event.target as IDBRequest).error);
            };
          } else {
            reject("Chat not found");
          }
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  }

  // Retrieve all messages for a specific chat
  public async getMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction("chats", "readonly");
        const store = transaction.objectStore("chats");

        const request = store.get(chatId);

        request.onsuccess = (event) => {
          const chat = (event.target as IDBRequest).result;
          if (chat) {
            resolve(chat.messages);
          } else {
            resolve([]); // Return empty array if chat not found or no messages
          }
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("Failed to get messages:", error);
      return [];
    }
  }

  // Generate a unique chatId
  private generateChatId(chatName: string): string {
    return `${chatName}_${Date.now()}`;
  }

  // Get all chats (with names)
  public async getChats(): Promise<{ chatId: string; name: string }[]> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction("chats", "readonly");
        const store = transaction.objectStore("chats");

        const request = store.getAll();

        request.onsuccess = (event) => {
          const chats = (event.target as IDBRequest).result;
          resolve(
            chats.map((chat: any) => ({ chatId: chat.chatId, name: chat.name }))
          );
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("Failed to get chats:", error);
      return [];
    }
  }

  // Singleton pattern to get the instance
  public static getInstance(): IndexDB {
    if (!IndexDB.instance) {
      IndexDB.instance = new IndexDB();
    }
    return IndexDB.instance;
  }
}
