import { useState, useEffect, type ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { id: 1, name: '权重分析', path: '/weights' },
  { id: 2, name: '项目评估', path: '/projects' },
  { id: 3, name: '预测推荐', path: '/prediction' },
];

export default function Layout({ children, currentStep, onStepChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f4ed' }}>
      {isMobile && (
        <header 
          className="fixed top-0 left-0 right-0 h-12 z-30 flex items-center px-4"
          style={{ backgroundColor: '#faf9f5', borderBottom: '1px solid #f0eee6' }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
            style={{ borderRadius: '8px' }}
          >
            <svg className="w-5 h-5" style={{ color: '#4d4c48' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 text-sm font-medium font-serif" style={{ color: '#141413' }}>
            奥运项目评估与预测系统
          </span>
        </header>
      )}

      <Sidebar
        steps={steps}
        currentStep={currentStep}
        onStepChange={(step) => {
          onStepChange(step);
          if (isMobile) setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        isMobile={isMobile}
      />
      
      <main 
        className={`transition-all duration-300 p-4 lg:p-6 ${isMobile ? 'pt-16 ml-0' : 'lg:ml-64'}`}
      >
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ backgroundColor: 'rgba(20, 20, 19, 0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
