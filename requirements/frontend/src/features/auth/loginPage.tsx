import { useMemo, useState } from "react";
import { login } from "../../api/auth";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { validateEmail, validatePassword } from "./inputValidators";

/*

Valid email: has min 1 alfanumericl char, then @, then min 1 alfanumericl char then . then min 1 alfanumericl char
(example: a@b.c)

*/


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formError, setFormError] = useState(""); // backend error
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(()=> {
	return validateEmail(email) === "" && validatePassword(password) === "";
  },  [email], [password]);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

	const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

	if (nextEmailError || nextPasswordError) return;

	setIsSubmitting(true);
    setFormError("");


    try {
      const result = await login({ email, password });
      console.log("SERVER RESPONSE:", result); //delete
      // step 3 later: save auth + navigate("/game")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <form onSubmit={onSubmit}>
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-sm mx-auto space-y-6">
        <label className="text-sm font-medium">Email</label>
          <Input
		  	error={emailError}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
					const v = e.target.value;
					setEmail(v);
					if (emailError) setEmailError(validateEmail(v)); // live-fix
				}}
				onBlur={() => setEmailError(validateEmail(email))} // show error after leaving field
			/>

          <label className="text-sm font-medium">Password</label>
          <Input
            error={passwordError}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              const v = e.target.value;
              setPassword(v);
              if (passwordError) setPasswordError(validatePassword(v));
            }}
            onBlur={() => setPasswordError(validatePassword(password))}
          />

          <Button disabled={!canSubmit || isSubmitting} type="submit" //maybe add rotating circle animation on loading 
		  >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button> 
      </div>
      </div>

    </form>
  );
}