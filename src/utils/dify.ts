import { getConfig } from "./config.js";
import fetch from "node-fetch";
import { sanitizeMessage } from "./openai.js";

export const generateCommitMessage = async (diff: string) => {
	const config = await getConfig();

	try {
		const response = await fetch("https://api.dify.ai/v1/completion-messages", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.DIFY_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				inputs: { diff },
				user: "cli",
			}),
		});

		const data = await response.json();

		// 检查响应状态是否为 OK
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		console.log("data", data.answer);
		return [sanitizeMessage(data.answer)] as string[];
	} catch (error) {
		console.error("Error:", error);
		throw error; // 重新抛出错误，以便调用者知道发生了错误
	}
};
