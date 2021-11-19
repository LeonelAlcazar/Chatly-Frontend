import React from "react";

export function Alert(props: { content: any; type: "error" | "success" }) {
	return <div className={"alert " + props.type}>{props.content}</div>;
}
