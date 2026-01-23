import { useState } from "react";
import { login } from "../../api/auth";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Card } from "../../components/card";


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
    <Card>
      <form onSubmit={onSubmit} className="w-full">
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">Log in</Button>
        </div>
      </form>
    </Card>
  );
}