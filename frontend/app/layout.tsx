import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'INTELLEX AI — Autonomous Security & Tech Intelligence Command Center',
  description: 'Autonomous AI Security & Technology Intelligence Researcher persona (Ada / Intellex)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-darkBg text-gray-100 font-body">
          {children}
        </div>
      </body>
    </html>
  );
}
