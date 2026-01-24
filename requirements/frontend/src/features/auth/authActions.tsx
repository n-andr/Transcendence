import { Button } from "../../components/button.tsx";

export default function AuthActions() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Button>Log in</Button>
      <Button variant="secondary">Sign up</Button>
    </div>
  )
}