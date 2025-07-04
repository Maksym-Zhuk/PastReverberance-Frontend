export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center">
      <div className="w-full max-w-412.5 min-h-[100dvh] flex flex-col-reverse lg:flex-row bg-[#e9e9e9]">
        {children}
      </div>
    </div>
  );
}
