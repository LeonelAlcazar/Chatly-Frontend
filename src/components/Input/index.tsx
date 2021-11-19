import React from "react";
import "./styles.css";

export function Input(
	props: React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>
) {
	return <input {...props} className="input" />;
}
