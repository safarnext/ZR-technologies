import "./globals.css";

export const metadata = {
  title: "ZR Technologies | Code • Cloud • Connect",
  description: "Professional websites, domains, Cloudflare, business email, backend and digital solutions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
