import React from "react";

export function User(props: {
	user: any;
	size?: "M" | "S";
	onClick?: CallableFunction;
}) {
	return (
		<div
			className={"user " + props.size + (props.onClick ? " hover" : "")}
			onClick={() => {
				if (props.onClick) {
					props.onClick();
				}
			}}
		>
			<img src={props.user?.pictureURL} className="profilePicture" />
			<div className="info">
				<strong>{props.user?.nickname}</strong>
				<span>
					<div className={props.user?.status}></div>{" "}
					{props.user?.status}
				</span>
			</div>
		</div>
	);
}
