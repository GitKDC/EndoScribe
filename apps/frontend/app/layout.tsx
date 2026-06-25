import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body, input, button, textarea, select {
            font-family: 'Inter', sans-serif !important;
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
      <body style={{ margin: 0, display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Header />
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}