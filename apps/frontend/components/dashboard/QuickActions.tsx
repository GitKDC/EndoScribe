"use client";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => router.push("/create-report")}>
        ➕ New Report
      </button>

      <button onClick={() => router.push("/templates")}>
        Manage Templates
      </button>
    </div>
  );
}