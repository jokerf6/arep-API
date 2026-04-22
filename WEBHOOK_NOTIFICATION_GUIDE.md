# Webhook & Asynchronous Notification System Guide

This document explains the internal "Webhook-like" event system implemented in this project, designed to handle asynchronous notifications (Push, SMS, Email) based on API events.

## 1. System Overview
The system follows an **Event-Driven Architecture**. It intercepts API requests, matches them against predefined notification rules, and processes them asynchronously using Redis-backed queues.

### Architecture Flow:
1.  **Listener (Middleware)**: Intercepts incoming requests and identifies if an event should trigger a notification.
2.  **Queue (Bull/Redis)**: Offloads the processing to a background job.
3.  **Processor (Worker)**: Executes the notification logic (Firebase, SMS, Email).

---

## 2. The Listener: Notification Middleware
**File Path:** [notification.middleware.ts](file:///home/fahd/projects/arep-api/src/globals/middlewares/notification.middleware.ts)

The middleware acts as the "Webhook Receiver" for internal events. It listens for successful API responses and triggers the notification flow.

```typescript
// Path: src/globals/middlewares/notification.middleware.ts

@Injectable()
export class NotificationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toLowerCase();
    const endpoint = req.originalUrl.split('/api/')[1];
    const eventName = `${endpoint}_${method}`; // e.g., 'auth/verify_post'

    res.on('finish', async () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        // Find matching notifications in DB and add to Queue
        for (const notification of notifications) {
          await this.notificationQueue.add(JobName.PROCESS_NOTIFICATION, {
            notification,
            targetUsers,
            // ...
          });
        }
      }
    });
    next();
  }
}
```

---

## 3. The "Messy Part": Dynamic Data Extraction
The biggest challenge was extracting the "Target User ID" from different request types dynamically. Since each endpoint has a different structure, the middleware must "guess" where the ID is.

**The Messy Snippet:**
```typescript
private extractTargetUserId(req: Request, user: any) {
  // Logic to find the ID across params, body, or current session
  return req.params.id || req.body.userId || req.body.id || user.id;
}
```
*Why it's messy?* Because it relies on naming conventions (`userId` vs `id`). If a new developer uses `customer_id`, this logic might fail unless updated.

---

## 4. Handling Duplicates, Retries, and Failures
We utilize **Bull** (powered by Redis) to ensure the system is robust.

### A. Failures & Retries
Bull automatically handles retries if a service (like Firebase or an SMS gateway) is down.
**File Path:** [worker.module.ts](file:///home/fahd/projects/arep-api/src/app/_modules/worker/worker.module.ts)

```typescript
BullModule.forRootAsync({
    useFactory: async (configService: ConfigService) => ({
        redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        },
        // Global retry strategies can be configured here
    }),
})
```

### B. Asynchronous Processor
The processor isolates failures. If one notification fails, it doesn't crash the API.
**File Path:** [notification.processor.ts](file:///home/fahd/projects/arep-api/src/app/_modules/worker/processors/notification.processor.ts)

```typescript
@Processor(QueueName.NOTIFICATION)
export class NotificationQueueProcessor {
  @Process(JobName.PROCESS_NOTIFICATION)
  async handleProcessNotification(job: Job) {
    try {
      // Logic to send Email, SMS, or Push
      await this.service.sendNotification(...);
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
      // Bull will retry this job based on settings
    }
  }
}
```

### C. Duplicates
While Bull handles job uniqueness via `jobId`, the system currently adds jobs based on the `res-finish` event. To prevent duplicates in a high-traffic environment, we can pass a unique `jobId` (e.g., `event_requestId`) to the `.add()` method.

---

## 5. Summary for Interviews
If asked about this in an interview, you can answer like this:

*   **Description**: I implemented a custom event-driven notification system that acts as an internal webhook. It tracks successful API calls and triggers background jobs for multi-channel notifications (Firebase, SMS, Email).
*   **Payload**: It captures the request context, user session, and specific identifiers from the request body/params.
*   **Messy Part**: The extraction logic for target users was challenging due to varying endpoint structures. I solved it by creating a centralized extraction helper that probes multiple request properties.
*   **Robustness**: I used **Bull/Redis** to handle retries and failures. This ensured that even if an external provider (like the SMS gateway) failed, the job would be retried without affecting the user's immediate experience.
