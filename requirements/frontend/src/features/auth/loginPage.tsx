import { useState } from "react";
import { login } from "../../api/auth";


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
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}