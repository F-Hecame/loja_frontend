import type { ReactNode } from "react";

export default function Empty({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon" aria-hidden>
        {icon}
      </div>
      <p>{children}</p>
    </div>
  );
}
