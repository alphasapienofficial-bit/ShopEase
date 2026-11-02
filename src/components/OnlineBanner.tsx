import { useOnlineStatus } from "../hooks/useOnlineStatus";

export function OnlineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white" role="alert">
      You are offline. Some features may not work.
    </div>
  );
}
