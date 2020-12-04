export const formatSeconds = function (sec: number | undefined): string {
	if (!sec) return "";
	const hours = Math.floor(sec / 3600);
	const minutes = Math.floor((sec - hours * 3600) / 60);
	const seconds = sec - hours * 3600 - minutes * 60;
	return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}min` : ""} ${Math.floor(seconds) ? `${Math.floor(seconds)}s` : ""}`;
};

export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
