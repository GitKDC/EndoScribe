import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body style={{ margin: 0, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Header />
          <div style={{ padding: "20px" }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}