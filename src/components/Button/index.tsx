import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export function Button(
	props: React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> & { variant?: "normal" | "success" | "warning"; loading?: boolean }
) {
	return (
		<button
			{...props}
			disabled={props.disabled || props.loading}
			className={"btn " + (props.variant || "normal")}
		>
			{props.loading && (
				<i className="btn-icon spinner">
					<FontAwesomeIcon icon={faSpinner} />
				</i>
			)}

			{props.children}
		</button>
	);
}
