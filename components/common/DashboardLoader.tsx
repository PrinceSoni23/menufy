"use client";

export function DashboardLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 h-36 w-36 overflow-hidden rounded-full bg-transparent sm:h-40 sm:w-40">
          <video
            className="h-full w-full object-cover"
            src="/loader.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        </div>
        <p className="text-sm font-semibold text-slate-600">{message}</p>
      </div>
    </div>
  );
}
