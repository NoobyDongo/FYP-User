
export default function RootLayout({ children }) {
  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-screen bg-zinc-100 dark:bg-zinc-950 z-[-1]" />
      {children}
    </>
  );
}
