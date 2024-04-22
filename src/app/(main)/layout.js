import Navigation from "@/components/navigation";

export const metadata = {
  title: "V# | Home",
  description: "Let's shop",
};

export default function RootLayout({ children }) {
  return (
    <Navigation>
      {children}
    </Navigation>
  );
}
