let customHeaders = {};

chrome.runtime.onInstalled.addListener(() => {
	// 初始化空的自定义请求头
	chrome.storage.local.set({ customHeaders: {} });
});

// 加载已存储的自定义请求头
chrome.storage.local.get('customHeaders', (data) => {
	customHeaders = data.customHeaders || {};
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, area) => {
	if (area === 'local' && changes.customHeaders) {
		customHeaders = changes.customHeaders.newValue || {};
	}
});

chrome.webRequest.onBeforeSendHeaders.addListener(
	(details) => {
		// 遍历用户自定义的请求头
		Object.keys(customHeaders).forEach(headerName => {
			const headerValue = customHeaders[headerName];
			
			// 查找并替换匹配的请求头
			for (let i = 0; i < details.requestHeaders.length; i++) {
				if (details.requestHeaders[i].name.toLowerCase() === headerName.toLowerCase()) {
					details.requestHeaders[i].value = headerValue;
					return;
				}
			}
			
			// 如果请求头不存在，则添加新的请求头
			details.requestHeaders.push({
				name: headerName,
				value: headerValue
			});
		});

		return { requestHeaders: details.requestHeaders };
	},
	{ urls: ["<all_urls>"] },
	["blocking", "requestHeaders"]
);
