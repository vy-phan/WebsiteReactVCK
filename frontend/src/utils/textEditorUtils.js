/**
 * Format selected text with HTML tags
 * @param {string} text - The full text content
 * @param {number} start - Selection start position
 * @param {number} end - Selection end position
 * @param {string} tag - Tag to apply ('b', 'i', or 'u')
 * @param {string} value - The value to apply to the tag
 * @returns {string} The text with formatting applied
 */
export const formatSelectedText = (text, start, end, tag, value) => {
  if (start === end) return text; // No text selected

  const selectedText = text.substring(start, end);
  const prefix = text.substring(0, start);
  const suffix = text.substring(end);

  // Kiểm tra xem text đã có thẻ HTML chưa và bảo toàn chúng
  const preserveHtmlTags = (text) => {
    // Danh sách các thẻ HTML phổ biến cần bảo toàn
    const allowedTags = [
      "p",
      "div",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "table",
      "tr",
      "td",
      "th",
      "img",
      "a",
      "code",
      "pre",
      "blockquote",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "br",
    ];

    // Tạo pattern để match các thẻ HTML
    const pattern = new RegExp(
      `<(\/?)(${allowedTags.join("|")})([^>]*)>`,
      "gi"
    );

    // Thay thế các thẻ HTML bằng placeholder tạm thời
    const placeholders = [];
    let tempText = text.replace(pattern, (match, p1, p2, p3, offset) => {
      placeholders.push(match);
      return `__HTML${placeholders.length - 1}__`;
    });

    return {
      text: tempText,
      placeholders,
    };
  };

  // Xử lý text được chọn
  const { text: cleanText, placeholders } = preserveHtmlTags(selectedText);

  // Áp dụng định dạng mới
  let formattedText = "";
  switch (tag) {
    case "b":
      formattedText = `<strong>${cleanText}</strong>`;
      break;
    case "i":
      formattedText = `<em>${cleanText}</em>`;
      break;
    case "u":
      formattedText = `<u>${cleanText}</u>`;
      break;
    case "h3":
      formattedText = `<h3 class="text-2xl font-bold my-4">${cleanText}</h3>`;
      break;
    case "h4":
      formattedText = `<h4 class="text-xl font-semibold my-3">${cleanText}</h4>`;
      break;
    case "img":
      formattedText = value 
        ? `<img src="${value}" alt="Image" class="max-w-full h-auto my-4 rounded-lg shadow-lg">`
        : cleanText;
      break;
    default:
      formattedText = cleanText;
  }

  // Khôi phục các thẻ HTML gốc
  formattedText = formattedText.replace(/__HTML(\d+)__/g, (_, index) => {
    return placeholders[parseInt(index)];
  });

  return prefix + formattedText + suffix;
};

/**
 * Sanitize HTML input to prevent XSS
 * @param {string} html - The HTML input to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  const allowedTags = [
    "p",
    "div",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "table",
    "tr",
    "td",
    "th",
    "img",
    "a",
    "code",
    "pre",
    "blockquote",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "br",
  ];

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Hàm đệ quy để duyệt và làm sạch các node
  const cleanNode = (node) => {
    if (node.nodeType === 3) {
      // Text node
      return;
    }

    if (node.nodeType === 1) {
      // Element node
      const tagName = node.tagName.toLowerCase();

      // Nếu tag không được cho phép, chỉ giữ lại nội dung
      if (!allowedTags.includes(tagName)) {
        const parent = node.parentNode;
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
      } else {
        // Lọc các attributes
        const attrs = node.attributes;
        for (let i = attrs.length - 1; i >= 0; i--) {
          const attrName = attrs[i].name;
          // Chỉ cho phép một số attributes an toàn
          if (!["href", "src", "alt", "title", "class"].includes(attrName)) {
            node.removeAttribute(attrName);
          }
        }

        // Xử lý đệ quy các node con
        Array.from(node.childNodes).forEach(cleanNode);
      }
    }
  };

  cleanNode(tempDiv);
  return tempDiv.innerHTML;
};
