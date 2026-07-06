function loadApiScript() {
	return new Promise(function (resolve, reject) {
		var script = document.createElement('script');
		script.src = 'https://ai.cloudservices.vn/web-apps/apps/api/documents/api.js';
		script.onload = resolve;
		script.onerror = function () {
			reject(new Error('Failed to load OnlyOffice api.js'));
		};
		document.head.appendChild(script);
	});
}

// Lấy tham số url từ search URL
function getParamByUrl(key) {
	return (
		decodeURIComponent(
			(new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(
				location.search
			) || ['', ''])[1].replace(/\+/g, '%20')
		) || null
	);
}

// Lấy tham số page từ hash URL dạng #page=2
function getPageFromHash() {
	var match = location.hash.match(/page=(\d+)/);
	return match ? parseInt(match[1], 10) : null;
}
