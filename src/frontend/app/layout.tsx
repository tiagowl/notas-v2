import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "@/contexts/StoreContext";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "Notas v2",
  description: "Arquivo pessoal de notas do ChatGPT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Provider>
          <StoreProvider>
            {children}
            <Toaster />
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
