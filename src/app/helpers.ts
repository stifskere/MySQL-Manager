
export function isEmptyOrWhitespace(content: string): boolean {
	return content === null || /^ *$/.test(content);
}

export function parsePostFormContent(content: string): { [key: string]: string } {
	const result: { [key: string]: string } = {};

	if (isEmptyOrWhitespace(content))
		return result;

	for (const pair of content.split('&')) {
		const keyValue: string[] = pair.split('=');

		if (keyValue.length !== 2)
			throw new Error("Error while parsing post form content.");

		result[keyValue[0]] = keyValue[1];
	}

	return result;
}