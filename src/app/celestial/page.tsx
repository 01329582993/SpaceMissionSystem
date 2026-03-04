// src/app/celestial/page.tsx
import CosmoLayout from "@/src/components/CosmoLayout";
import CelestialCalendar from "@/src/components/CelestialCalendar";
import CelestialAlertsWidget from "@/src/components/CelestialAlertsWidget";

export default function CelestialPage() {
    return (
        <CosmoLayout>
            <div
                style={{
                    backgroundColor: "#000",
                    minHeight: "100vh",
                    padding: "60px 40px",
                    color: "#fff",
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
                }}
            >
                {/* HEADER */}
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: "60px",
                        paddingBottom: "20px",
                        borderBottom: "1px solid #222"
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "2.6rem",
                                fontWeight: "900",
                                letterSpacing: "-1px",
                                textTransform: "uppercase"
                            }}
                        >
                            Celestial Observatory
                        </h1>
                        <p
                            style={{
                                color: "#888",
                                margin: "6px 0 0 0",
                                letterSpacing: "2px",
                                fontSize: "0.75rem",
                                textTransform: "uppercase"
                            }}
                        >
                            Space Weather & Orbital Events // Synchronized
                        </p>
                    </div>
                </header>

                <CelestialCalendar />
                <CelestialAlertsWidget />
            </div>
        </CosmoLayout>
    );
}
