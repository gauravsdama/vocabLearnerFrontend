import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiGet, apiPost } from "../api/client";
import type { MessageDTO, MessagesResponse } from "../api/types";
import { setMessageHandler } from "../utils/messageBus";
import { extractMessages } from "../utils/messageUtils";
import Button from "./Button";
import Card from "./Card";

const DISMISS_KEY = "vocab_messages_dismissed_v1";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type MessageContextValue = {
  messages: MessageDTO[];
  addMessages: (messages: MessageDTO[]) => void;
  fetchMessages: () => Promise<void>;
  dismissMessage: (id: string) => Promise<void>;
};

const MessageContext = createContext<MessageContextValue | undefined>(undefined);

function loadDismissed() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) {
      return {} as Record<string, number>;
    }
    const parsed = JSON.parse(raw) as Record<string, number>;
    return parsed ?? {};
  } catch {
    return {} as Record<string, number>;
  }
}

function saveDismissed(payload: Record<string, number>) {
  try {
    localStorage.setItem(DISMISS_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function pruneDismissed(map: Record<string, number>) {
  const now = Date.now();
  let changed = false;
  Object.keys(map).forEach((key) => {
    if (now - map[key] > DISMISS_TTL_MS) {
      delete map[key];
      changed = true;
    }
  });
  if (changed) {
    saveDismissed(map);
  }
  return map;
}

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<MessageDTO[]>([]);

  const addMessages = useCallback((incoming: MessageDTO[]) => {
    if (!incoming.length) {
      return;
    }
    const dismissed = pruneDismissed(loadDismissed());
    setMessages((prev) => {
      const byId = new Map(prev.map((item) => [item.id, item]));
      incoming.forEach((message) => {
        if (!message?.id) {
          return;
        }
        if (dismissed[message.id]) {
          return;
        }
        if (!byId.has(message.id)) {
          byId.set(message.id, message);
        }
      });
      return Array.from(byId.values());
    });
  }, []);

  const fetchMessages = useCallback(async () => {
    const response = await apiGet<MessagesResponse | MessageDTO[]>("/messages");
    addMessages(extractMessages(response));
  }, [addMessages]);

  const dismissMessage = useCallback(async (id: string) => {
    if (!id) {
      return;
    }
    const dismissed = pruneDismissed(loadDismissed());
    dismissed[id] = Date.now();
    saveDismissed(dismissed);
    setMessages((prev) => prev.filter((item) => item.id !== id));
    try {
      await apiPost(`/messages/${id}/dismiss`);
    } catch {
      // best effort
    }
  }, []);

  useEffect(() => {
    setMessageHandler(addMessages);
    return () => setMessageHandler(null);
  }, [addMessages]);

  const value = useMemo(
    () => ({ messages, addMessages, fetchMessages, dismissMessage }),
    [messages, addMessages, fetchMessages, dismissMessage],
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessageContext);
  if (!ctx) {
    throw new Error("useMessages must be used within MessageProvider");
  }
  return ctx;
}

function getTone(message: MessageDTO) {
  const level =
    message.level ??
    (message as { type?: string | null }).type ??
    (message as { severity?: string | null }).severity ??
    "info";
  if (level === "success") {
    return "success";
  }
  if (level === "warning") {
    return "warning";
  }
  if (level === "error") {
    return "error";
  }
  return "info";
}

export default function MessageCenter() {
  const { messages, dismissMessage } = useMessages();
  if (!messages.length) {
    return null;
  }

  return (
    <div className="message-center" role="status">
      {messages.map((message) => {
        const tone = getTone(message);
        const dismissible = message.dismissible !== false;
        const rawTitle =
          message.title ??
          (message as { heading?: string | null }).heading ??
          null;
        const rawBody =
          message.body ??
          (message as { message?: string | null }).message ??
          null;
        const title =
          typeof rawTitle === "string"
            ? rawTitle
            : rawTitle
              ? JSON.stringify(rawTitle)
              : null;
        const body =
          typeof rawBody === "string"
            ? rawBody
            : rawBody
              ? JSON.stringify(rawBody)
              : null;
        return (
          <Card
            key={message.id}
            className={`message-banner message-banner-${tone}`}
          >
            <div className="message-banner-header">
              <span className={`badge badge-${tone}`}>
                {tone === "error"
                  ? "Alert"
                  : tone === "warning"
                    ? "Notice"
                    : tone === "success"
                      ? "Success"
                      : "Update"}
              </span>
              {dismissible ? (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => dismissMessage(message.id)}
                >
                  Dismiss
                </Button>
              ) : null}
            </div>
            <div className="message-banner-body">
              {title ? <h3 className="ds-h2">{title}</h3> : null}
              {body ? <p className="ds-body muted">{body}</p> : null}
            </div>
            {message.action_url ? (
              <div className="message-banner-actions">
                <a
                  className="button button-secondary button-md"
                  href={message.action_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {message.action_label ?? "Learn more"}
                </a>
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
