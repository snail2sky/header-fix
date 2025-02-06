document.addEventListener('DOMContentLoaded', () => {
	const headersContainer = document.getElementById('headersContainer');
	const addHeaderBtn = document.getElementById('addHeaderBtn');
	const saveButton = document.getElementById('saveButton');

	// 加载已存储的自定义请求头
	chrome.storage.local.get('customHeaders', (data) => {
		const headers = data.customHeaders || {};
		
		// 清空现有行
		headersContainer.innerHTML = '';
		
		// 如果没有存储的请求头，添加一个默认空行
		if (Object.keys(headers).length === 0) {
			addHeaderRow();
		} else {
			// 为每个已存储的请求头创建输入行
			Object.entries(headers).forEach(([name, value]) => {
				addHeaderRow(name, value);
			});
		}
	});

	// 添加请求头行
	function addHeaderRow(name = '', value = '') {
		const row = document.createElement('div');
		row.className = 'header-row';
		row.innerHTML = `
			<input type="text" class="header-name" placeholder="Header Name" value="${name}">
			<input type="text" class="header-value" placeholder="Header Value" value="${value}">
			<button class="remove-header">-</button>
		`;
		
		// 为输入框添加回车事件监听
		const nameInput = row.querySelector('.header-name');
		const valueInput = row.querySelector('.header-value');
		
		nameInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				saveHeaders();
			}
		});

		valueInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				saveHeaders();
			}
		});
		
		row.querySelector('.remove-header').addEventListener('click', () => {
			row.remove();
			// 如果没有剩余行，添加一个空行
			if (document.querySelectorAll('.header-row').length === 0) {
				addHeaderRow();
			}
		});
		
		headersContainer.appendChild(row);
	}

	// 添加新的请求头行按钮
	addHeaderBtn.addEventListener('click', () => {
		addHeaderRow();
	});

	// 抽取保存逻辑为单独的函数
	function saveHeaders() {
		const headerRows = document.querySelectorAll('.header-row');
		const customHeaders = {};

		headerRows.forEach(row => {
			const nameInput = row.querySelector('.header-name');
			const valueInput = row.querySelector('.header-value');
			
			if (nameInput.value.trim()) {
				customHeaders[nameInput.value.trim()] = valueInput.value.trim();
			}
		});

		chrome.storage.local.set({ customHeaders }, () => {
			showToast('请求头已成功更新');
		});
	}

	// 保存按钮事件
	saveButton.addEventListener('click', saveHeaders);

	// Toast 提示函数
	function showToast(message) {
		const toast = document.getElementById('toast');
		toast.textContent = message;
		toast.className = 'show';
		setTimeout(() => { 
			toast.className = toast.className.replace('show', ''); 
		}, 3000);
	}
});
