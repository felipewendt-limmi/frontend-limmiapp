import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "LIMMI Granel",
  description: "Tecnologia Viva em Alimentos a Granel",
};

import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
