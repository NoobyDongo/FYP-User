import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"

import "@/styles/globals.css";
import "@/fonts/inter/inter.css";
import { CartProvider } from "@/client/cart-context";


export const metadata = {
  title: "V#",
  description: "Shop here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>

          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>

        <Toaster position="bottom-center"
          icons={{
            success: "✅",
            info: "⚠️",
            warning: "⚠️",
            error: "⚠️",
          }} />
      </body>

    </html>
  );
}
