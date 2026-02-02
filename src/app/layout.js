import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "LIMMI",
  description: "Tecnologia Viva em Alimentos a Granel",
};

import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
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
