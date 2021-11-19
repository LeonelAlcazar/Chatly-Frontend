import React from "react";
import "./styles.css";

export function Message(props: { message: any }) {
	return (
		<div className="message">
			<img src={props.message.user.pictureURL} />
			<div className="message-body">
				<div className="message-body-header">
					<strong>{props.message.user.nickname}</strong>
					<span>{props.message.createdAt}</span>
				</div>
				<div style={{ whiteSpace: "pre-line" }}>
					{props.message.content}
				</div>
			</div>
		</div>
	);
}
