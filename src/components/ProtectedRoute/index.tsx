import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Link,
	Routes,
	PathRouteProps,
	LayoutRouteProps,
	IndexRouteProps,
} from "react-router-dom";
import AuthProvider, { useAuth } from "../../providers/AuthProvider";

export function ProtectedRoute(props: {
	noAuthElement: any;
	authElement: any;
}) {
	const authContext = useAuth();

	if (authContext?.state.user) return props.authElement;
	return props.noAuthElement;
}
