import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/auth";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "./inputValidators";
import { useAuth } from "../auth/AuthContext";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      validateEmail(email) === "" &&
      validateUsername(username) === "" &&
      validatePassword(password) === ""
    );
  }, [email, username, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1) frontend validation
    const nextEmailError = validateEmail(email);
    const nextUsernameError = validateUsername(username);
    const nextPasswordError = validatePassword(password);

    setEmailError(nextEmailError);
    setUsernameError(nextUsernameError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextUsernameError || nextPasswordError) return;

    // 2) submit
    setIsSubmitting(true);
    setFormError("");
    setSuccessMsg("");

    try {
      const res = await signup({
        email: email.trim(),
        username: username.trim(),
        password,
      });

      // 3) show success
      setSuccessMsg(res.message || "Account created successfully 🎉");

      // 4) after 3s → authorize + redirect
      setTimeout(() => {
        setLoggedIn({
          email: email.trim(),
        });
        navigate("/game");
      }, 3000);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setFormError(msg);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-sm mx-auto space-y-6">
          <h1 className="text-xl font-semibold text-gray-900">Sign up</h1>

          <label className="text-sm font-medium">Email</label>
          <Input
            error={emailError}
            value={email}
            onChange={(e) => {
              const v = e.target.value;
              setEmail(v);
              if (emailError) setEmailError(validateEmail(v));
            }}
            onBlur={() => setEmailError(validateEmail(email))}
          />

          <label className="text-sm font-medium">Username</label>
          <Input
            error={usernameError}
            value={username}
            onChange={(e) => {
              const v = e.target.value;
              setUsername(v);
              if (usernameError) setUsernameError(validateUsername(v));
            }}
            onBlur={() => setUsernameError(validateUsername(username))}
          />

          <label className="text-sm font-medium">Password</label>
          <Input
            error={passwordError}
            type="password"
            value={password}
            onChange={(e) => {
              const v = e.target.value;
              setPassword(v);
              if (passwordError) setPasswordError(validatePassword(v));
            }}
            onBlur={() => setPasswordError(validatePassword(password))}
          />

          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {successMsg && (
            <p className="text-sm text-green-700">{successMsg}</p>
          )}

          <Button disabled={!canSubmit || isSubmitting} type="submit">
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
        </div>
      </div>
    </form>
  );
}
