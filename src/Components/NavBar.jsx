import ThemeSelector from "../Components/ThemeController"; // Assuming you have a ThemeSelector component
export default function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 shadow-md ">
      <div className="flex">
        <div className="mx-4 flex gap-2 items-center justify-center">
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
