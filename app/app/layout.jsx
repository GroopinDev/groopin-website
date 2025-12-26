import "./app.css";

export const metadata = {
  title: "Groopin Web",
  description: "Groopin web companion."
};

export default function AppLayout({ children }) {
  return (
    <div className="groopin-app">
      <div className="app-shell">{children}</div>
    </div>
  );
}
