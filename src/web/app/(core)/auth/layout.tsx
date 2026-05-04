import React from 'react';
import { Card } from "@/components/ui/card";

interface PageLayoutProps {
    children?: React.ReactNode;
}

export default function Layout({ children }: PageLayoutProps) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundImage: "url('/images/gradient-background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div
                className="absolute inset-0 opacity-0"
                style={{
                    background: "rgba(0, 0, 0, 0.15)",
                }}
            ></div>

            <Card
                className="max-w-md shadow-2xl relative z-10 opacity-100 w-[126%] mx-[0] border-transparent"
                style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(40px) saturate(250%)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow:
                        "0 32px 80px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(255, 255, 255, 0.2), inset 0 3px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.3)",
                }}
            >
            {children}
            </Card>
        </div>
    );
}
