import React from 'react';

interface PageLayoutProps {
    children?: React.ReactNode;
}

export default function Layout({ children }: PageLayoutProps) {
  return (
    <div className="w-screen h-screen">
      {children}
    </div>
  );
}
