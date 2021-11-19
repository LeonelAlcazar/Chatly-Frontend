import axios from "axios";
import Cookies from "js-cookie";
import config from "../config";

const endpoint = config.api.endpoint;

export async function GetWithQuery(query: any) {
	const token = Cookies.get("session");
	if (!token) {
		throw new Error("no token");
	}
	try {
		const response = await axios.get(
			endpoint + "/user?" + new URLSearchParams(query).toString(),
			{
				headers: { authorization: "BEARER " + token },
			}
		);

		return response.data.body;
	} catch (e) {
		throw e;
	}
}

export async function GetUser(id: string) {
	const token = Cookies.get("session");
	if (!token) {
		throw new Error("no token");
	}
	try {
		const response = await axios.get(endpoint + "/user/" + id, {
			headers: { authorization: "BEARER " + token },
		});

		return response.data.body;
	} catch (e) {
		throw e;
	}
}
