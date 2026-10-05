import { useEffect, useRef, useState } from "react";
import { Bell, BarChart3, Check, Repeat2, Target, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotificationItem {
id: number;
title: string;
message: string;
type: "budget" | "goal" | "recurring" | "summary";
isRead: boolean;
}

interface NotificationPreferences {
  budget: boolean;
  goal: boolean;
  recurring: boolean;
  summary: boolean;
}

const initialNotifications: NotificationItem[] = [
{
id: 1,
title: "Budget Reminder",
message: "Review your current monthly spending and budget progress.",
type: "budget",
isRead: false,
},
{
id: 2,
title: "Goal Reminder",
message: "Keep your financial goals on track by reviewing your progress.",
type: "goal",
isRead: false,
},
{
id: 3,
title: "Recurring Expense",
message: "Check your upcoming recurring expenses.",
type: "recurring",
isRead: true,
},
{
id: 4,
title: "Monthly Summary",
message: "Your monthly financial summary is ready to review.",
type: "summary",
isRead: true,
},
];

function Notifications() {
const navigate = useNavigate();

const [isOpen, setIsOpen] = useState(false);
const [notifications, setNotifications] =
  useState<NotificationItem[]>(() => {
    const savedPreferences = localStorage.getItem(
      "notification_preferences"
    );

    if (!savedPreferences) {
      return initialNotifications;
    }

    try {
      const preferences: NotificationPreferences =
        JSON.parse(savedPreferences);

      return initialNotifications.filter(
        (notification) => preferences[notification.type]
      );
    } catch {
      return initialNotifications;
    }
  });

const notificationRef = useRef<HTMLDivElement>(null);

const unreadCount = notifications.filter(
(notification) => !notification.isRead
).length;

useEffect(() => {
const handleOutsideClick = (event: MouseEvent) => {
if (
notificationRef.current &&
!notificationRef.current.contains(event.target as Node)
) {
setIsOpen(false);
}
};

document.addEventListener("mousedown", handleOutsideClick);

return () => {
  document.removeEventListener("mousedown", handleOutsideClick);
};

}, []);

useEffect(() => {
  const updateNotifications = () => {
    const savedPreferences = localStorage.getItem(
      "notification_preferences"
    );

    if (!savedPreferences) {
      setNotifications(initialNotifications);
      return;
    }

    try {
      const preferences: NotificationPreferences =
        JSON.parse(savedPreferences);

      setNotifications(
        initialNotifications.filter(
          (notification) => preferences[notification.type]
        )
      );
    } catch {
      setNotifications(initialNotifications);
    }
  };

  window.addEventListener(
    "notification-preferences-changed",
    updateNotifications
  );

  return () => {
    window.removeEventListener(
      "notification-preferences-changed",
      updateNotifications
    );
  };
}, []);

const handleNotificationClick = (notification: NotificationItem) => {
setNotifications((currentNotifications) =>
currentNotifications.map((currentNotification) =>
currentNotification.id === notification.id
? {
...currentNotification,
isRead: true,
}
: currentNotification
)
);

setIsOpen(false);

if (notification.type === "budget") {
  navigate("/budgets");
  return;
}

if (notification.type === "goal") {
  navigate("/goals");
  return;
}

if (notification.type === "recurring") {
  navigate("/recurring");
  return;
}

if (notification.type === "summary") {
  navigate("/dashboard");
}

};

const handleMarkAllAsRead = () => {
setNotifications((currentNotifications) =>
currentNotifications.map((notification) => ({
...notification,
isRead: true,
}))
);
};

const getNotificationIcon = (
type: NotificationItem["type"]
) => {
if (type === "budget") {
return <WalletCards size={17} />;
}

if (type === "goal") {
  return <Target size={17} />;
}

if (type === "recurring") {
  return <Repeat2 size={17} />;
}

return <BarChart3 size={17} />;
};

return ( <div ref={notificationRef} className="relative">
<button
type="button"
onClick={() => setIsOpen((current) => !current)}
className="relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
aria-label="Notifications"
aria-expanded={isOpen}
> <Bell size={19} />

    {unreadCount > 0 && (
      <>
        <span className="app-primary absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" />

        <span className="sr-only">
          {unreadCount} unread notifications
        </span>
      </>
    )}
  </button>

  {isOpen && (
    <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Notifications
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "You're all caught up"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="text-xs font-medium app-primary-text transition hover:opacity-80"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[360px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Bell
              size={28}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No notifications
            </p>

            <p className="mt-1 text-xs text-slate-500">
              You're all caught up.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition last:border-b-0 hover:bg-slate-50 ${
                !notification.isRead
                  ? "app-primary-light"
                  : "bg-white"
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  !notification.isRead
                    ? "app-primary-soft app-primary-text"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {notification.title}
                  </p>

                  {!notification.isRead && (
                    <span className="app-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                  )}
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {notification.message}
                </p>
              </div>

              {/* Read indicator */}
              {notification.isRead && (
                <Check
                  size={15}
                  className="mt-1 shrink-0 text-slate-300"
                />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-4 py-3">
        <p className="text-center text-xs text-slate-400">
          Finance Intelligence
        </p>
      </div>
    </div>
  )}
</div>


);
}

export default Notifications;