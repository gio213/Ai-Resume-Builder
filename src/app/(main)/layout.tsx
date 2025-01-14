import NavBar from "./NavBar";

type LayoutType = {
  children: React.ReactNode;
};
export default function Layout({ children }: LayoutType) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      {children}
    </div>
  );
}
