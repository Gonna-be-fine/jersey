function downloadJSON(data, filename = 'data.json') {
  // 将对象转为 JSON 字符串
  const jsonStr = JSON.stringify(data, null, 2);

  // 创建 Blob 对象
  const blob = new Blob([jsonStr], { type: 'application/json' });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  // 释放 URL 对象
  URL.revokeObjectURL(url);
}

export { downloadJSON };