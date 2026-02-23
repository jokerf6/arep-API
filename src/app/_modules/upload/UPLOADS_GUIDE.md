# 🚀 Upload Integration Guide for Frontend

This document explains how to integrate the unified upload flow in the frontend. The system automatically switches between **AWS S3** and **Local Storage** based on the environment, providing a consistent experience.

---

## 🛠 The Three-Step Workflow

Whether the backend is using AWS or Local storage, the frontend process is identical:

### 1. Request an Upload URL

Call the `presigned-url` endpoint to get a target URL and a unique file key.

**Endpoint:** `POST /api/upload/presigned-url`
**Body:**

```json
{
  "filename": "profile-pic.png",
  "filetype": "image/png",
  "folder": "avatars"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Presigned URL generated successfully",
  "data": {
    "url": "https://...", // OR http://localhost:3030/api/upload/local-upload/..."
    "key": "avatars/uuid-profile-pic.png"
  }
}
```

### 2. Upload the Binary Data

Perform a `PUT` request directly to the `url` received in Step 1.

> [!IMPORTANT]
>
> - Use the **PUT** method.
> - Send the file as **Binary/Raw** data in the body (not as FormData/Multipart).
> - Set the `Content-Type` header to your file's mime-type (e.g., `image/png`).

**Example (Using Axios):**

```javascript
const file = // get from input
  await axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type },
  });
```

### 3. Verify the Upload

Once the binary upload (Step 2) is finished, notify the backend to verify the file and save its metadata.

**Endpoint:** `POST /api/upload/verify`
**Body:**

```json
{
  "key": "avatars/uuid-profile-pic.png" // The key from Step 1
}
```

---

## ⚠️ Validation & Constraints

The system enforces strict security and performance rules:

### File Size Limits

- **Images:** Max **10MB**
- **Videos:** Max **500MB** (Detected by extension)
- **Others:** Max **10MB**

### Allowed Types

- **Images:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`
- **Documents:** `.pdf`, `.txt`
- **Videos:** `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`, `.m4v`

### Blocked Files

- Executables, scripts, and server-side files are strictly blocked (`.exe`, `.php`, `.js`, etc.).

---

## 💡 Best Practices

1. **Progress Bars:** Since you are uploading directly via `PUT`, it's easy to implement upload progress bars in the UI using Axios `onUploadProgress`.
2. **Key Storage:** Only store the `key` (e.g., `avatars/xyz.png`) in your database/models. The backend will use this key to generate download URLs later.
3. **Local Development:** When working locally with `AWS_MEDIA=false`, the `url` provided in Step 1 will point to your local server. No frontend code changes are needed!
