import React from "react";

export function FormItem(props: {
	children: React.ReactElement;
	label: string;
}) {
	return (
		<div>
			<label className="form-item">{props.label}</label>
			{props.children}
		</div>
	);
}
