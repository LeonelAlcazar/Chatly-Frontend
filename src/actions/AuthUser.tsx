import axios from "axios";
import config from "../config";

const endpoint = config.api.endpoint;

export async function AuthUser(data: { email: string; password: string }) {
	try {
		const response = await axios.post(endpoint + "/auth/login", data);

		return response.data;
	} catch (e) {
		throw e;
	}
}
