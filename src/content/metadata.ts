import type { SiteNotification } from "./schema";

export function isNotificationActive(notification: SiteNotification, now = new Date()): boolean {
  if (notification.startsAt && new Date(notification.startsAt) > now) return false;
  if (notification.endsAt && new Date(notification.endsAt) < now) return false;
  return true;
}