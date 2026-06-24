import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body style={{ margin: 0, display: "flex", height: "100vh", overflow: "hidden" }}>
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