import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { ListSidebar } from "./ListSidebar";
import { useInfluencerStore } from "../store/useInfluencerStore";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, setSidebarOpen } = useInfluencerStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-purple-600 selection:text-white relative overflow-hidden">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none z-0 select-none" />
      <div className="absolute top-[30%] right-[5%] w-[450px] h-[450px] bg-indigo-600/8 rounded-full blur-[110px] pointer-events-none z-0 select-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-cyan-600/5 rounded-full blur-[90px] pointer-events-none z-0 select-none" />

      {/* Navigation */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col relative z-10">
        {children}
      </main>

      {/* Campaign List Sidebar */}
      <ListSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950/60 backdrop-blur-md text-center text-xs text-slate-500 mt-auto relative z-0">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Wobb Discovery. Built with React, TypeScript, and Zustand.</p>
        </div>
      </footer>
    </div>
  );
}
