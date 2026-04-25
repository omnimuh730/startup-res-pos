# Schema · Support Chat & Articles

The CatchTable Helper chat shown in Profile -> Contact Support, plus the help-article catalog used by quick-topic taps.

Source READMEs:

- `reservation/Profile/README.md` (Contact Support)

## Collections

| Collection | Purpose |
|---|---|
| `support_conversations` | One chat thread per user-initiated support session. |
| `support_messages` | Messages inside a conversation; user, bot, or human agent. |
| `support_articles` | Help articles linked to quick-topic chips. |

---

## `support_conversations`

```ts
type SupportConversation = {
  _id: ObjectId;
  customerUserId: ObjectId;

  source: "profile" | "discover" | "dining" | "booking" | "auth";
  topicAtStart?: "booking" | "qr_pay" | "password" | "cancel" | "live_agent" | string;

  status: "open" | "with_bot" | "with_agent" | "resolved" | "closed";
  assignedAgentId?: ObjectId;       // -> staff_users (support role) or external agent id

  // Cached preview for the conversations list
  lastMessage?: {
    body: string;
    sender: "user" | "bot" | "agent";
    sentAt: Date;
  };
  unreadCountForUser: number;
  unreadCountForAgent: number;

  closedAt?: Date | null;
  rating?: number | null;           // CSAT 1-5
  ratingComment?: string | null;

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ customerUserId: 1, status: 1, updatedAt: -1 }`
- `{ status: 1, updatedAt: -1 }`         // agent queue
- `{ assignedAgentId: 1, status: 1, updatedAt: -1 }`

State diagram:

```text
open ─bot greets─▶ with_bot ─quick_topic─▶ with_bot
with_bot ─talk to a human─▶ with_agent ─resolve─▶ resolved ─close─▶ closed
```

Realtime channels: `support.message.created`, `support.agent.assigned`, `support.conversation.closed`.

---

## `support_messages`

```ts
type SupportMessage = {
  _id: ObjectId;
  conversationId: ObjectId;
  customerUserId: ObjectId;         // denormalized for fan-out

  sender: "user" | "bot" | "agent" | "system";
  agentId?: ObjectId;               // present when sender="agent"

  body?: string;
  attachments?: Array<{
    kind: "image" | "file";
    url: string;
    name?: string;
    sizeBytes?: number;
  }>;

  // For bot messages with quick-reply chips
  quickTopics?: Array<{
    code: string;                   // "book_table", "qr_pay", "save_heart", "forgot_password", "cancel_booking", "talk_human"
    label: string;
  }>;

  // For typed user messages, the bot may attach a recommended article
  articleId?: ObjectId;             // -> support_articles

  readByUserAt?: Date | null;
  readByAgentAt?: Date | null;

  sentAt: Date;
  createdAt: Date;
};
```

Indexes:

- `{ conversationId: 1, sentAt: 1 }`
- `{ customerUserId: 1, sentAt: -1 }`
- `{ articleId: 1 }`

The Contact Support modal renders the welcome bot message, the quick-topic chips, and the bottom topic chips (`Live agent`, `Booking`, `QR Pay`) by inserting predefined `support_messages` rows when the conversation is created.

---

## `support_articles`

Help articles served by topic chips and bot quick-reply buttons. The Profile Help & Guide row routes to the same catalog.

```ts
type SupportArticle = {
  _id: ObjectId;
  topic: string;                    // "qr_pay", "booking"...
  slug: string;                     // url-safe
  title: string;
  bodyMarkdown: string;
  steps?: Array<{ title: string; body: string; imageUrl?: string }>;

  locale: string;                   // "en-US"
  active: boolean;
  publishedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
};
```

Indexes:

- `{ slug: 1 }` unique
- `{ topic: 1, active: 1 }`
- `{ locale: 1, active: 1 }`
- text index on `title`, `bodyMarkdown` for in-chat search

Quick-topic chip mapping (used both in `support_messages.quickTopics` and to look up articles):

| Code | Label | Default article topic |
|---|---|---|
| `book_table` | How do I book a table? | `booking` |
| `qr_pay` | How does QR Pay work? | `qr_pay` |
| `save_heart` | Save to Heart list | `saved` |
| `forgot_password` | I forgot my password | `password_recovery` |
| `cancel_booking` | Cancel a booking | `cancel_booking` |
| `talk_human` | Talk to a human | (escalates: sets conversation to `with_agent`) |

---

## Cross-document rules

- A new conversation always starts with a system "user opened chat" message, then a bot greeting plus the quick-topic message.
- Tapping `Talk to a human` flips `support_conversations.status` to `with_agent` and routes to the agent queue.
- Mark-as-read updates patch the corresponding `readByUserAt`/`readByAgentAt` and reset the matching unread counter on the conversation.
- Resolving a conversation prompts the user for a rating; the rating is stored back on `support_conversations.rating`.
