import { useState } from "react";
import { login } from "../../api/auth";
import { Input } from "../../components/input";
import { Button } from "../../components/button";


//not a working feature 

/*

Example of http request:

we have a login form with login and password
when user clicks on submit
we form a http request with login and password using login function which calls a postJson wrapper

*/

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await login({ email, password }); // http request 
    console.log("SERVER RESPONSE:", result);
	//handel the result
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-sm mx-auto space-y-6">
        <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit">
            Log in
          </Button>
      </div>
      </div>

    </form>
  );
}