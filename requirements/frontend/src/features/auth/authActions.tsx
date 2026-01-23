import { Link } from "react-router-dom";
import { Button } from "../../components/button.tsx";

export default function AuthActions() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
      <Link to="/login" className="w-full">
        <Button className="w-full">Log in</Button>
      </Link>
      <Link to="/register" className="w-full">
        <Button variant="secondary" className="w-full">Sign up</Button>
      </Link>
    </div>
  )
}