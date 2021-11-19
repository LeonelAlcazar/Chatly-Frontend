import React, { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSignOutAlt,
	faBars,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { GetUser } from "../../actions/GetUser";
import { User } from "../User";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";

export function DashboardNavbar(props: {}) {
	const authContext = useAuth();
	const [users, setUsers] = useState([]);
	const [open, setOpen] = useState(true);
	let navigation = useNavigate();

	const handleStatusChange = (data: { id: string; status: string }) => {
		let users_c: any = [...users];
		console.log(users_c, users);
		for (let i = 0; i < users_c.length; i++) {
			if (users_c[i].id == data.id) {
				users_c.status = data.status;
				break;
			}
		}
		setUsers(users_c);
	};

	useEffect(() => {
		GetUser("")
			.then((users) => {
				setUsers(users);
			})
			.catch((e) => console.log(e));

		const e = authContext?.state.suscribeTo(
			"statusUpdate",
			handleStatusChange
		);

		return () => {
			authContext?.state.unsuscribeTo(e);
		};
	}, []);

	return (
		<div className={"navbar " + (open ? "open" : "closed")}>
			<div className="navbar-header">
				<div className="header-responsive">
					<h1>Chatly</h1>
					<button
						onClick={() => {
							setOpen(!open);
						}}
					>
						{open ? (
							<FontAwesomeIcon icon={faTimes} />
						) : (
							<FontAwesomeIcon icon={faBars} />
						)}
					</button>
				</div>

				<User user={authContext?.state.user} />
			</div>
			<div
				className="users-list"
				style={{ height: "100%", overflowY: "scroll" }}
			>
				<h3>Users</h3>
				{authContext?.state.users?.length > 0 &&
					authContext?.state.users.map(
						(user: any) =>
							user.id != authContext?.state.user?.id && (
								<User
									user={user}
									size="S"
									onClick={() => {
										navigation(
											"/messages/" + user.nickname
										);
									}}
								/>
							)
					)}
			</div>
			<div className="navbar-bottom">
				<div
					className="navbar-footer"
					onClick={() => authContext?.state.SignOut()}
				>
					<FontAwesomeIcon icon={faSignOutAlt} /> Sign out
				</div>
			</div>
		</div>
	);
}
