import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthUser } from "../../actions/AuthUser";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { FormItem } from "../../components/FormItem";
import { Input } from "../../components/Input";
import { useAuth } from "../../providers/AuthProvider";
import "./styles.css";
export function HomeNoAuth() {
	const authContext = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [alertResponse, setAlertResponse]: [any, CallableFunction] =
		useState(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		AuthUser({
			email,
			password,
		})
			.then((response) => {
				setEmail("");
				setPassword("");
				setAlertResponse(
					<Alert content="Wait to redirect..." type="success" />
				);
				setLoading(false);
				authContext?.state.SignInWithToken(response.body);
			})
			.catch((e) => {
				console.log(e.response);
				setLoading(false);
				setAlertResponse(
					<Alert content={e.response.data.body} type="error" />
				);
			});
	};
	return (
		<div className="container-main">
			<div className="panel">
				<h1>Welcome to Chatly!</h1>
				<form onSubmit={handleSubmit}>
					<FormItem label="Email">
						<Input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</FormItem>
					<FormItem label="Password">
						<Input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</FormItem>
					<Button loading={loading}>Login</Button>
					{alertResponse}
					<Link to="/register">Dont have an account? Register</Link>
				</form>
			</div>
		</div>
	);
}
