import "./globals.css";
import FloatingAI from "../components/FloatingAI";
import GlobalHeader from "../components/GlobalHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased relative font-mono">
        {/* The Header now persists across all system pages */}
        <GlobalHeader />
        
        <main>
          {children}
        </main>
        
        {/* Floating AI assistant for mission support */}
        <FloatingAI />
      </body>
    </html>
  );
}