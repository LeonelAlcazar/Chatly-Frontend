import axios from "axios";
import config from "../config";

const endpoint = config.api.endpoint;

export async function RegisterUser(data: {
	email: string;
	password: string;
	nickname: string;
	pictureURL: string;
}) {
	try {
		const response = await axios.post(endpoint + "/user", data);

		return response.data;
	} catch (e) {
		throw e;
	}
}
