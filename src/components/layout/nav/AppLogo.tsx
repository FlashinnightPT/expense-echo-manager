
import { Link } from "react-router-dom";

export function AppLogo() {
  return (
    <Link to="/" className="mr-6 flex items-center space-x-2">
      <span className="hidden font-bold sm:inline-block">Gestão Financeira</span>
    </Link>
  );
}
