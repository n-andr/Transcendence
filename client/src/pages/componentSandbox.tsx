import { Input } from "../components/input.tsx";
import { Button } from "../components/button.tsx";

export function ComponentSandbox() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-sm mx-auto space-y-6">
        <h1 className="text-lg font-semibold">
          Input component
        </h1>

        <Input
          label="Email"
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          error="This email is not valid"
        />

        <Button>
          Log in
        </Button>

        <Button variant="secondary">
          Sign up
        </Button>

      </div>
    </div>
  );
}
