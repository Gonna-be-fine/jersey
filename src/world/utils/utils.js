function isSVGString(str) {
  if (typeof str !== 'string') return false;
  
  // 去掉开头空白和可能的 BOM
  const trimmed = str.trimStart();
  
  // 必须以 <svg 开头（允许前面有 XML 声明或 BOM）
  return /^<\?xml[^>]*\?>[\s]*<svg/i.test(trimmed) || 
         /^<svg[\s>]/i.test(trimmed);
}

export { isSVGString };