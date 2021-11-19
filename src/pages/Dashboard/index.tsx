import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { GetMessagesOf } from "../../actions/GetMessagesOf";
import { GetWithQuery } from "../../actions/GetUser";
import { SendMessage } from "../../actions/SendMessage";
import { Button } from "../../components/Button";
import { DashboardNavbar } from "../../components/DashboardNavbar";
import { Input } from "../../components/Input";
import { Message } from "../../components/Message";
import { User } from "../../components/User";
import { useAuth } from "../../providers/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

function Chat(props: {
	chatName: string;
	chatImage?: string;
	status?: string;
}) {
	const authContext = useAuth();
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const [userID, setUserID] = useState("");
	const [user, setUser]: [any, CallableFunction] = useState(null);
	const [messages, setMessages]: [any[], CallableFunction] = useState([]);

	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			const mode = location.pathname.split("/")[1];
			console.log(mode);

			if (mode == "messages") {
				const users = await GetWithQuery({ nickname: params.user });
				console.log(users);
				if (users?.length > 0) {
					setUserID(users[0].id);
					const msgs = await GetMessagesOf(users[0].id);
					console.log("MENSAJES", msgs);
					setMessages(msgs);
				} else {
					navigate("/");
				}
			}
		})();
	}, [props.chatName, location.pathname]);

	useEffect(() => {
		const uContext = authContext?.state.users.find(
			(u: any) => u.id == userID
		);
		setUser(uContext);
		if (!uContext) {
			authContext?.state.UpdateData();
			navigate(location.pathname);
		}

		authContext?.state.socket.on("message", (data: any) => {
			if (data.receiver_id == userID || data.sender_id == userID) {
				console.log(data, messages);
				setMessages((allMessages: any[]) => [...allMessages, data]);
			}
		});

		return () => {
			authContext?.state.socket.removeAllListeners("message");
		};
	}, [userID]);
	useEffect(() => {
		console.log("updatee");
		if (userID != "") {
			const uContext = authContext?.state.users.find(
				(u: any) => u.id == userID
			);
			setUser(uContext);
		}
	}, [authContext]);

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (content !== "") {
			setLoading(true);
			SendMessage({ receiver_id: user?.id, content })
				.then((value) => {
					console.log(value);
					setLoading(false);
					setContent("");
				})
				.catch((e) => {
					console.log(e.response);
					setLoading(false);
				});
		}
	};

	return (
		<div className="chat">
			<div className="chat-header">
				<User user={user} />
			</div>
			<div
				className="messages"
				style={{ display: "flex", flexDirection: "column-reverse" }}
			>
				{messages.length > 0 &&
					messages
						.sort((a: any, b: any) => {
							const ad: any = new Date(a.createdAt);
							const bd: any = new Date(b.createdAt);
							return bd - ad;
						})
						.map((message: any) => {
							return <Message message={message} />;
						})}
			</div>
			<form className="send-message" onSubmit={handleSubmit}>
				<textarea
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
					}}
				/>
				<Button loading={loading}>SEND</Button>
			</form>
		</div>
	);
}

export function Dashboard(props: any) {
	const authContext = useAuth();
	const params = useParams();
	const location = useLocation();
	console.log(location);
	return (
		<div>
			<DashboardNavbar />
			{location.pathname != "/" && (
				<Chat
					chatName={params.user || ""}
					chatImage={authContext?.state.user.pictureURL}
					status={"online"}
				/>
			)}
		</div>
	);
}
