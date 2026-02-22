"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Missions", href: "/missions" },
  { name: "Fleet", href: "/spacecraft" },
  { name: "Personnel", href: "/personnel" },
  { name: "Alerts", href: "/alerts" },
  { name: "Logs", href: "/logs" },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

export default function CosmoLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans">


      <aside className="relative w-[320px] h-full bg-[#050b18] border-r border-white/5 flex-shrink-0">


        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.1),transparent_70%)]" />


        <motion.div
          className="relative z-10 flex h-full flex-col pl-10 pt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >


          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-[32px] font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#6ee7ff] via-[#3b82f6] to-[#9333ea]">
              CosmoTrack
            </h1>

            <p className="mt-2 text-[14px] font-light tracking-wide text-white/50">
              EST. 2026
            </p>
          </motion.div>

          <nav className="flex flex-col gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className="group relative inline-block no-underline"
                  >

                    <span
                      className={`
                        text-[18px] 
                        font-medium
                        tracking-tight
                        transition-all
                        duration-500
                        ease-out
                        block
                      `}
                      style={{
                        color: isActive ? "#6ee7ff" : "white",
                        opacity: isActive ? 1 : 0.6
                      }}
                    >
                      {item.name}


                      <motion.span
                        className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-[#6ee7ff] to-transparent"
                        initial={{ width: 0 }}
                        animate={{ width: isActive ? "100%" : 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      </aside>


      <main className="relative flex-1 h-full overflow-y-auto overflow-x-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 h-full w-full object-cover -z-10"
        >
          <source src="/videos/cosmo.mp4" type="video/mp4" />
        </video>

        <div className="fixed inset-0 bg-black/60 -z-10" />

        <div className="relative z-10 w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
