import ActiveStatus from "./components/activeStatus";
import AuthContext from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";

export const metadata = {
  title: "NavShiksha-Chat",
  description: "NavShiksha-Chat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthContext>
            <>
              <ActiveStatus />
              <ToasterContext />
              {children}
            </>
        </AuthContext>
      </body>
    </html>
  );
}