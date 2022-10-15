const readableBytes = (bytes, decimals = 2) => {
	if (bytes === undefined) return "Bundling..."
	if (bytes == 0) return "0 Bytes"
	const k = 1000
	const dm = decimals || 2
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export { readableBytes }
