# MoodLink - Firestore Schema

## Collections

### `users`
- **uid** (string) — Firebase Auth UID
- **email** (string)
- **displayName** (string)
- **username** (string)
- **age** (number)
- **gender** (string) — male | female | non-binary | other
- **preferredGender** (string) — male | female | non-binary | everyone
- **bio** (string)
- **interests** (array of strings)
- **city** (string)
- **region** (string)
- **photoURL** (string) — Firebase Storage URL
- **mood** (string) — one of 16 mood IDs
- **communicationMode** (string) — text | voice | video
- **isOnline** (boolean)
- **isPremium** (boolean)
- **premiumPlan** (string | null)
- **premiumExpiry** (timestamp | null)
- **privacy** (map) — { location: string, profile: string }
- **blockedUsers** (array of UIDs)
- **dailyMatchCount** (number)
- **dailyChatRequests** (number)
- **lastMatchReset** (timestamp)
- **isAdmin** (boolean)
- **isSuspended** (boolean)
- **isBanned** (boolean)
- **createdAt** (timestamp)
- **updatedAt** (timestamp)

### `chats/{chatId}/messages`
- **text** (string)
- **senderId** (string)
- **senderName** (string)
- **createdAt** (timestamp)

### `notifications`
- **userId** (string)
- **type** (string) — like | message | connect | premium | report
- **title** (string)
- **message** (string)
- **data** (map) — { fromUserId, etc. }
- **read** (boolean)
- **createdAt** (timestamp)

### `reports`
- **reportedBy** (string — UID)
- **reportedUser** (string — UID)
- **category** (string) — from REPORT_CATEGORIES IDs
- **details** (string)
- **status** (string) — pending | resolved | action-taken
- **resolvedAt** (timestamp | null)
- **createdAt** (timestamp)

### `subscriptions`
- **userId** (string)
- **plan** (string) — monthly | quarterly | yearly
- **status** (string) — active | expired | cancelled
- **startDate** (timestamp)
- **endDate** (timestamp)
- **createdAt** (timestamp)
