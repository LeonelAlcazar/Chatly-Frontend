import React from "react";
import logo from "./logo.svg";
import "./App.css";

import {
	BrowserRouter as Router,
	Route,
	Link,
	Routes,
	useNavigate,
} from "react-router-dom";
import { HomeNoAuth } from "./pages/HomeNoAuth";
import { Register } from "./pages/Register";
import AuthProvider from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";

function Redirect(props: { to: string }) {
	let navigate = useNavigate();
	navigate(props.to);

	return <div></div>;
}

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/">
						<Route
							index
							element={
								<ProtectedRoute
									authElement={<Dashboard />}
									noAuthElement={<HomeNoAuth />}
								/>
							}
						/>

						<Route path="register" element={<Register />} />
						<Route
							path="messages/:user"
							element={
								<ProtectedRoute
									authElement={<Dashboard />}
									noAuthElement={<Redirect to="/" />}
								/>
							}
						/>
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
