# Household OS — Architecture & Technical Blueprint

## 1. System Overview & Hybrid Infrastructure
- **Mobile Frontend**: React Native + Expo (SDK 52+), Expo Router (file-based navigation), TypeScript, Zustand, TanStack Query, React Hook Form + Zod, SecureStore.
- **Backend API & Microservices**: Node.js / TypeScript REST & WebSocket API deployed via Docker / PM2 on **Hostinger VPS**.
- **Database**: MongoDB (Self-hosted replica set on Hostinger VPS) with Mongoose / native MongoDB driver.
- **Storage & Media**: S3-compatible object storage (e.g. MinIO on VPS or Cloudflare R2 / Firebase Storage for receipts, warranties, photos).
- **Push Notifications**: Expo Server SDK / FCM integration triggered from VPS backend workers.
- **Scheduled Jobs**: Node-Cron / BullMQ worker on VPS for recurring tasks, bill reminders, maintenance calculation, and daily digest notifications.

---

## 2. Multi-Tenant Household Domain Model (MongoDB)

### Data Partitioning Principle
Every household entity is isolated strictly by `householdId: ObjectId` with an indexed compound structure `{ householdId: 1, ... }`.

### Core Schemas:
1. **Users (`users`)**:
   - `_id`, `email`, `passwordHash`, `name`, `avatarUrl`, `phone`, `authProvider`, `deviceTokens: []`, `defaultHouseholdId`, `createdAt`, `updatedAt`
2. **Households (`households`)**:
   - `_id`, `name`, `avatarUrl`, `currency` (e.g. `IDR`, `USD`), `timezone`, `locale`, `ownerId`, `inviteCode`, `createdAt`, `updatedAt`
3. **Members (`members`)**:
   - `_id`, `householdId`, `userId`, `role` (`OWNER` | `ADMIN` | `ADULT` | `TEEN` | `CHILD` | `GUEST`), `nickname`, `joinedAt`, `permissionsOverride`
4. **Tasks (`tasks`)**:
   - `_id`, `householdId`, `title`, `description`, `createdBy`, `assignedTo: []`, `status` (`TODO` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`), `priority` (`LOW` | `MEDIUM` | `HIGH` | `URGENT`), `category`, `dueDate`, `reminder`, `recurrence` (rule, interval, until), `estimatedCost`, `actualCost`, `attachments: []`, `linkedEntity: { type, id }`, `completedAt`, `completedBy`
5. **Calendar Events (`events`)**:
   - `_id`, `householdId`, `title`, `description`, `startDate`, `endDate`, `allDay`, `location`, `recurrence`, `attendees: []`, `linkedEntityType`, `linkedEntityId`, `reminderMinutesBefore`
6. **Finance Transactions (`transactions`)**:
   - `_id`, `householdId`, `amount` (integer minor units, e.g. IDR whole rupiahs / cents), `type` (`INCOME` | `EXPENSE`), `category`, `description`, `date`, `createdBy`, `visibility` (`HOUSEHOLD` | `SPOUSE` | `PRIVATE`), `linkedTaskId`, `linkedAssetId`, `linkedBillId`
7. **Budgets (`budgets`)**:
   - `_id`, `householdId`, `month` (`YYYY-MM`), `totalBudget`, `categoryAllocations: [{ category, limit }]`, `currency`
8. **Assets (`assets`)**:
   - `_id`, `householdId`, `name`, `category`, `brand`, `model`, `serialNumber`, `purchaseDate`, `purchasePrice`, `warrantyExpiration`, `location`, `assignedOwnerId`, `notes`, `photos: []`, `documents: []`
9. **Maintenance Records (`maintenance`)**:
   - `_id`, `householdId`, `assetId`, `title`, `date`, `cost`, `provider`, `notes`, `currentUsage`, `nextMaintenanceDate`, `nextMaintenanceUsage`, `receipts: []`
10. **Bills & Subscriptions (`bills`)**:
    - `_id`, `householdId`, `name`, `amount`, `frequency` (`MONTHLY` | `ANNUALLY` | `WEEKLY` | etc.), `dueDay`, `nextDueDate`, `category`, `assignedTo`, `autoCreateTask: boolean`, `reminderDaysBefore: []`, `status` (`ACTIVE` | `PAUSED`)
11. **Family Diary (`diary`)**:
    - `_id`, `householdId`, `title`, `date`, `description`, `photos: []`, `participants: [userId]`, `location`, `tags: []`
12. **Universal Timeline Events (`timeline`)**:
    - `_id`, `householdId`, `eventType` (`TASK_COMPLETED` | `BILL_PAID` | `EXPENSE` | `INCOME` | `MAINTENANCE` | `ASSET_ADDED` | `DIARY` | `EVENT` | `MEMBER_JOINED`), `title`, `summary`, `actorId`, `amount`, `occurredAt`, `refId`, `refCollection`

---

## 3. Role-Based Access Control (RBAC) Matrix

| Module / Action | OWNER | ADMIN | ADULT | TEEN | CHILD | GUEST |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Household Settings & Delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Members & Roles | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Tasks & Assign | ✅ | ✅ | ✅ | Own/Shared | Assigned only | View permitted |
| Family Calendar (View/Add) | ✅ | ✅ | ✅ | ✅ | View / Own | View public |
| Finance & Budgets | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bills & Subscriptions | ✅ | ✅ | ✅ | View only | ❌ | ❌ |
| Assets & Maintenance | ✅ | ✅ | ✅ | View only | View only | ❌ |
| Family Diary | ✅ | ✅ | ✅ | ✅ | View & Add | View shared |
| Universal Timeline | ✅ | ✅ | ✅ | Permitted | Permitted | Permitted |

---

## 4. Hostinger VPS & MongoDB Deployment Architecture

```text
[ Mobile App (Expo: iOS / Android) ]
                   │
                   ▼ (HTTPS / WSS with JWT Auth)
     [ NGINX Reverse Proxy + SSL (Certbot) on VPS ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
[ Express / NestJS API ] [ WebSocket Server ]
 (PM2 / Dockerized)       (Realtime updates)
         │                   │
         └─────────┬─────────┘
                   ▼
       [ Local MongoDB on VPS ]
         (Authentication & replica set)
```
- **Cron Worker**: Handles recurring task spawning and notification scheduling (e.g., checks upcoming bills 3 days before due date).
- **Security & Firewall**: UFW configured (ports 80, 443, 22 only open to public), MongoDB bound to `127.0.0.1` or internal Docker network.

---

## 5. Navigation & Screen Architecture (Expo Router)

```text
app/
├── (auth)/
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   └── forgot-password.tsx
├── (onboarding)/
│   ├── welcome.tsx
│   ├── create-household.tsx
│   └── join-household.tsx
└── (tabs)/
    ├── index.tsx (Home Dashboard)
    ├── tasks/
    │   ├── index.tsx
    │   ├── [id].tsx
    │   └── new.tsx
    ├── calendar/
    │   ├── index.tsx
    │   └── [id].tsx
    ├── family/
    │   ├── index.tsx
    │   └── invite.tsx
    └── more/
        ├── index.tsx
        ├── finance/
        ├── bills/
        ├── assets/
        ├── maintenance/
        ├── diary/
        ├── timeline/
        └── settings/
```
