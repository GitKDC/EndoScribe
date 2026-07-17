import AuthWrapper from "../components/AuthWrapper";
import LicenseGate from "../components/LicenseGate";
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'] 
});

export default function RootLayout({ children }: any) {
  return (
    <html>
      <head>
        <style>{`
          input, button, textarea, select {
            font-family: inherit !important;
          }
          input[type="date"]::-webkit-calendar-picker-indicator {
            opacity: 0;
            cursor: pointer;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          input[type="date"] {
            position: relative;
          }
        `}</style>
      </head>
      <body className={inter.className} style={{ margin: 0, display: "flex", height: "100vh", overflow: "hidden" }}>
        <LicenseGate>
          <AuthWrapper>{children}</AuthWrapper>
        </LicenseGate>
      </body>
    </html>
  );
}