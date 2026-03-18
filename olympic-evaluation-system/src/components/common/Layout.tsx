import { useState, useEffect, type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { id: 1, name: 'AHP权重', path: '/ahp' },
  { id: 2, name: 'EWM权重', path: '/ewm' },
  { id: 3, name: '混合权重', path: '/hybrid' },
  { id: 4, name: '项目评估', path: '/projects' },
  { id: 5, name: '预测推荐', path: '/prediction' },
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
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} />
      <div className="flex">
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
        <main className={`flex-1 p-4 lg:p-6 pt-20 transition-all duration-300 ${isMobile ? 'ml-0' : 'lg:ml-64'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}