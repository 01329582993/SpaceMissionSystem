"use client";

import Link from "next/link";

export default function MissionRow({ mission }: { mission: any }) {
  return (
    <Link
      href={`/missions/${mission.mission_id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 2fr 1fr 1fr 1fr 120px",
          padding: "22px 30px",
          alignItems: "center",
          borderTop: "1px solid #f1f5f9",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f9fafb")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#ffffff")
        }
      >
        <div style={{ fontWeight: "600", color: "#6b7280" }}>
          {mission.mission_id}
        </div>

        <div style={{ fontWeight: "700", fontSize: "1rem" }}>
          {mission.mission_name}
        </div>

        {/* STATUS */}
        <div>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.7rem",
              fontWeight: "700",
              textTransform: "uppercase",
              backgroundColor:
                mission.mission_status === "Active"
                  ? "#dcfce7"
                  : mission.mission_status === "Completed"
                  ? "#e0e7ff"
                  : "#f3f4f6",
              color:
                mission.mission_status === "Active"
                  ? "#166534"
                  : mission.mission_status === "Completed"
                  ? "#3730a3"
                  : "#374151",
            }}
          >
            {mission.mission_status}
          </span>
        </div>

        <div style={{ color: "#374151", fontWeight: "500" }}>
          {mission.commander_name || "Unassigned"}
        </div>

        <div
          style={{
            fontWeight: "700",
            color:
              (mission.alert_count || 0) > 0 ? "#dc2626" : "#9ca3af",
          }}
        >
          {mission.alert_count || 0}
        </div>

        <div style={{ fontWeight: "700" }}>
          {mission.fuel_level || 0}%
        </div>
      </div>
    </Link>
  );
}