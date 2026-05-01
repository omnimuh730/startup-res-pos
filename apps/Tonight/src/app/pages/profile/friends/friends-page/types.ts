export interface Contact {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  initials: string;
  color: string;
}

export interface FriendRequest extends Contact {
  requestedAt: string;
  note: string;
}

export interface BlockedContact extends Contact {
  blockedAt: string;
  reason: string;
}
