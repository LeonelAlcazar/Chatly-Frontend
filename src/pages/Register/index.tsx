import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RegisterUser } from "../../actions/RegisterUser";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { FormItem } from "../../components/FormItem";
import { Input } from "../../components/Input";

export function Register() {
	const [nickname, setNickname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [alertResponse, setAlertResponse]: [any, CallableFunction] =
		useState(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		RegisterUser({
			email,
			nickname,
			password,
			pictureURL:
				"https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png",
		})
			.then((response) => {
				setEmail("");
				setNickname("");
				setPassword("");
				setAlertResponse(
					<Alert
						content="Successfully registered. Now, you can sign in"
						type="success"
					/>
				);
				setLoading(false);
			})
			.catch((e) => {
				console.log(e.response);
				setAlertResponse(
					<Alert content={e.response.data.body} type="error" />
				);
				setLoading(false);
			});
	};

	return (
		<div className="container-main">
			<div className="panel">
				<h1>Sign up an account</h1>
				<form onSubmit={handleSubmit}>
					<FormItem label="Nickname">
						<Input
							type="text"
							required
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
						/>
					</FormItem>
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
					<Button loading={loading}>Register</Button>
					{alertResponse}
					<Link to="/">You already have an account? Sign in</Link>
				</form>
			</div>
		</div>
	);
}
