# Audit Log API

The Audit module records every **create**, **update**, and **delete** operation made against any database entity automatically. Specific actions (like Login / Logout) are also logged explicitly. The Frontend uses this module to display an activity/change history to admins.

Base path: `/api/v1/audit`

---

## Endpoints

### 1. Get List of Tracked Entities

Returns the names of all database entities that are being audited. Use this to populate an entity filter dropdown.

```
GET /api/v1/audit/entities
```

**Response**

```json
{
  "message": "get audit entities",
  "data": [
    "User",
    "Role",
    "Order",
    "Product",
    ...
  ]
}
```

---

### 2. Get Audit History (with filters & pagination)

Returns a paginated list of audit log entries. All query parameters are optional.

```
GET /api/v1/audit
```

**Query Parameters**

| Parameter    | Type     | Required | Description                                           |
| ------------ | -------- | -------- | ----------------------------------------------------- |
| `page`       | `number` | No       | Page number (default: 1)                              |
| `limit`      | `number` | No       | Items per page (default: all if omitted)              |
| `entityName` | `string` | No       | Filter by entity type e.g. `User`, `Order`, `Product` |
| `entityId`   | `string` | No       | Filter by the ID of a specific entity record          |
| `id`         | `number` | No       | Fetch a single log by its ID (skips pagination)       |

**Example Requests**

```
# All logs, paginated
GET /api/v1/audit?page=1&limit=20

# All changes on the "User" entity
GET /api/v1/audit?entityName=User&page=1&limit=20

# All changes on a specific user (id = 5)
GET /api/v1/audit?entityName=User&entityId=5

# Single log by its audit log ID
GET /api/v1/audit?id=42
```

**Response**

```json
{
  "message": "get audit history",
  "data": [
    {
      "id": 1,
      "entityName": "User",
      "entityId": "5",
      "entityLabel": "John Doe",
      "action": "UPDATE",
      "userId": "2",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0 ...",
      "metadata": null,
      "originalValues": { "name": "Old Name" },
      "newValues": { "name": "John Doe" },
      "createdAt": "2026-02-24T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 150
  }
}
```

---

### 3. Get Single Audit Log Entry

Returns the full details of one audit log entry by its ID.

```
GET /api/v1/audit/:id
```

**Path Parameter**

| Parameter | Type     | Description            |
| --------- | -------- | ---------------------- |
| `id`      | `number` | The audit log entry ID |

**Example**

```
GET /api/v1/audit/42
```

**Response**

```json
{
  "message": "get audit log",
  "data": {
    "id": 42,
    "entityName": "Product",
    "entityId": "10",
    "entityLabel": "Laptop Pro",
    "action": "DELETE",
    "userId": "3",
    "ip": "10.0.0.1",
    "userAgent": "Mozilla/5.0 ...",
    "metadata": null,
    "originalValues": { "name": "Laptop Pro", "price": 1200 },
    "newValues": null,
    "createdAt": "2026-02-24T11:30:00.000Z"
  }
}
```

---

## Response Object Fields

| Field            | Type              | Description                                                       |
| ---------------- | ----------------- | ----------------------------------------------------------------- |
| `id`             | `number`          | Unique ID of the log entry                                        |
| `entityName`     | `string`          | The type of record that was changed (e.g. `User`, `Order`)        |
| `entityId`       | `string`          | The ID of the record that was changed                             |
| `entityLabel`    | `string \| null`  | Human-readable label (name/title/username of the record)          |
| `action`         | `string`          | What happened: `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`    |
| `userId`         | `string \| null`  | ID of the user who performed the action                           |
| `ip`             | `string \| null`  | IP address of the request                                         |
| `userAgent`      | `string \| null`  | Browser / client info                                             |
| `metadata`       | `object \| null`  | Extra context (e.g. `{ method: "password" }` for login)           |
| `originalValues` | `object \| null`  | Snapshot of the record **before** the change (UPDATE/DELETE only) |
| `newValues`      | `object \| null`  | Snapshot of the record **after** the change (CREATE/UPDATE only)  |
| `createdAt`      | `ISO 8601 string` | When the action occurred                                          |

---

## Actions Reference

| Action   | When it appears                             |
| -------- | ------------------------------------------- |
| `CREATE` | A new record was created                    |
| `UPDATE` | An existing record was updated              |
| `DELETE` | A record was deleted                        |
| `LOGIN`  | A user logged in (explicit, not automatic)  |
| `LOGOUT` | A user logged out (explicit, not automatic) |

> **Note:** `originalValues` and `newValues` are automatically captured by the system on every `CREATE`, `UPDATE`, and `DELETE`. For `LOGIN` and `LOGOUT`, only `metadata` is populated (e.g. login method).
