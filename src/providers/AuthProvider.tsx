import React, { Component, createContext, useEffect } from "react";
import Cookies from "js-cookie";
import { GetUser } from "../actions/GetUser";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.0.110:8080";

export const AuthContext = createContext<{
	state: any;
	dispatch: React.Dispatch<any>;
} | null>(null);

function AuthReducer(state: any, action: any) {
	switch (action.type) {
		case "set":
			return { ...state, ...action.newState };
		case "setdeep":
			return (() => {
				let s = { ...state };

				const keys = Object.keys(action.newState);
				for (let k of keys) {
					s[k] = { ...s[k], ...action.newState[k] };
				}

				return s;
			})();
		case "updateuser":
			return (() => {
				let s = { ...state };

				let user = action.user;
				const id = user.id;
				delete user.id;

				for (let i = 0; i < state.users.length; i++) {
					if (s.users[i].id == id) {
						s.users[i] = { ...s.users[i], ...user };
						break;
					}
				}

				return s;
			})();

		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
}

function AuthProvider({ children }: any) {
	const [state, dispatch] = React.useReducer(AuthReducer, {
		user: null,
		users: [],
		socket: null,
		SignInWithToken,
		SignOut,
		suscribeTo,
		unsuscribeTo,
		UpdateData,
	});
	const value = { state, dispatch };

	const ioCallbacks: {
		[key: string]: { id: string; callback: CallableFunction }[];
	} = {
		statusUpdate: [],
	};

	useEffect(() => {
		const token = Cookies.get("session");
		if (token) {
			OnStartUp(token);
		}
	}, []);

	function RunCallbacks(callback: string, data: any) {
		for (let c of ioCallbacks[callback]) {
			c.callback(data);
		}
	}

	async function UpdateData() {
		try {
			const user = await GetUser("me");
			const users = await GetUser("");
			dispatch({ type: "set", newState: { user: user, users: users } });

			return user;
		} catch (e) {
			Cookies.remove("session");
			dispatch({ type: "set", newState: { user: null } });
			throw e;
		}
	}

	function UpdateUserData(data: any & { id: string }) {
		const id = data.id;
		delete data.id;

		const keys = Object.keys(data);
	}

	function OnStartUp(token: string) {
		UpdateData()
			.then((user) => {
				const socket = socketIOClient(ENDPOINT);
				console.log("connected");
				socket.emit("auth", { token });
				socket.on("auth", (data) => {
					console.log("Error on auth:", data);
				});
				socket.on("statusUpdate", (data) => {
					if (data?.id == user?.id) {
						dispatch({
							type: "setdeep",
							newState: {
								user: {
									status: data.status,
								},
							},
						});
					} else {
						dispatch({
							type: "updateuser",
							user: data,
						});
					}
				});
				socket.on("message", (data) => {});
				dispatch({ type: "set", newState: { socket } });
			})

			.catch((e) => console.log(e));
	}

	function SignOut() {
		Cookies.remove("session");
		dispatch({ type: "set", newState: { user: null } });
		window.location.href = "/";
	}

	function SignInWithToken(token: string) {
		Cookies.set("session", token);
		OnStartUp(token);
	}

	function suscribeTo(eventName: string, callback: CallableFunction) {
		const randomID =
			Math.round(Math.random() * 1000) +
			"-" +
			Math.round(Math.random() * 1000) +
			"-" +
			Math.round(Math.random() * 1000);

		ioCallbacks[eventName].push({ id: randomID, callback });
		return { id: randomID, eventName };
	}

	function unsuscribeTo(eventHandler: { id: string; eventName: string }) {
		ioCallbacks[eventHandler.eventName].find(
			(value) => value.id == eventHandler.id
		);
	}

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useModals must be used within a NewToProvider");
	}

	return context;
}

export default AuthProvider;
