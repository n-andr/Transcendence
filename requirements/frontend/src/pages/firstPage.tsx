import AuthLayout from "../layouts/authLayout.tsx"
import AuthActions from "../features/auth/authActions.tsx"
import Logo from "../features/auth/logo.tsx"
import { Card } from "../components/card.tsx";

export default function FirstPage() {
  return (
 	<AuthLayout>
		<Card>
 		<div className="flex flex-col items-center gap-6">
			<Logo />
    		<AuthActions />
  		</div>
		</Card>
	</AuthLayout>
  );
}