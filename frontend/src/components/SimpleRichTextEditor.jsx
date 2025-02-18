import React, { useState, useRef } from 'react';
import { formatSelectedText } from '../utils/textEditorUtils';
import { EyeIcon, CodeBracketIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Or any icon library you prefer
import { marked } from 'marked';

const SimpleRichTextEditor = ({ value, onChange }) => {
    const [text, setText] = useState(value || '');
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [viewMode, setViewMode] = useState('html'); // 'html' or 'preview'

    const handleFormat = (tag, value) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newText = formatSelectedText(
            text,
            start,
            end,
            tag,
            tag === 'img' ? value : undefined
        );
        setText(newText);
        onChange(newText);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const clipboardText = e.clipboardData.getData('text/plain');
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = text.slice(0, start) + clipboardText + text.slice(end);
        setText(newText);
        onChange(newText);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            let newText;
            if (e.shiftKey) {
                newText = text.slice(0, start) + '<br>' + text.slice(end); // Shift + Enter for <br>
            } else {
                newText = text.slice(0, start) + '\n' + text.slice(end);      // Just Enter for newline (preserved by pre-wrap)
            }
            setText(newText);
            onChange(newText);
        }
    };

    const handleImageInsert = () => {
        const imageUrl = prompt('Nhập URL hình ảnh:');
        if (!imageUrl) return;

        // Kiểm tra URL hợp lệ
        try {
            new URL(imageUrl);
        } catch (e) {
            alert('URL không hợp lệ! Vui lòng nhập lại.');
            return;
        }

        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Chèn thẻ img với URL
        const imgTag = `<img src="${imageUrl}" alt="Image" class="max-w-full h-auto my-4 rounded-lg shadow-lg">`;
        const newText = text.slice(0, start) + imgTag + text.slice(end);

        setText(newText);
        onChange(newText);
    };

    const toggleViewMode = (mode) => {
        setViewMode(mode);
    };

    return (
        <div className="rich-text-editor">
            <div className="flex gap-2 mb-2 items-center">
                <button
                    type="button"
                    onClick={() => handleFormat('h3')}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <strong>H3</strong>
                </button>
                <button
                    type="button"
                    onClick={() => handleFormat('h4')}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <strong>H4</strong>
                </button>
                <button
                    type="button"
                    onClick={() => handleFormat('b')}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => handleFormat('i')}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => handleFormat('u')}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <u>U</u>
                </button>
                <button
                    type="button"
                    onClick={handleImageInsert}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Chèn URL hình ảnh"
                >
                    <PhotoIcon className="h-5 w-5" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageInsert}
                    accept="image/*"
                    className="hidden"
                />
                <div className="flex gap-1 ml-2">
                    <button
                        type="button"
                        onClick={() => toggleViewMode('preview')}
                        className={`p-1 rounded ${viewMode === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        title="Xem trước"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleViewMode('html')}
                        className={`p-1 rounded ${viewMode === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        title="HTML Source"
                    >
                        <CodeBracketIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="relative border rounded-md">
                {viewMode === 'html' ? (
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            onChange(e.target.value);
                        }}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        className="mt-1 block w-full rounded-md p-4 bg-gray-100 dark:bg-gray-700 
                                 border-gray-300 shadow-sm focus:border-blue-500 
                                 focus:ring-blue-500 focus:outline-none dark:text-white 
                                 min-h-[150px] max-h-[400px] overflow-y-auto whitespace-pre-wrap"
                        style={{
                            resize: 'vertical',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
                        }}
                    />
                ) : (
                    <div
                        className="mt-1 block w-full rounded-md p-4 bg-gray-100 dark:bg-gray-700 
                                 border-gray-300 shadow-sm focus:border-blue-500 
                                 focus:ring-blue-500 focus:outline-none dark:text-white 
                                 min-h-[150px] max-h-[400px] overflow-y-auto whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                            __html: marked.parse(text, { breaks: true, sanitize: false }) 
                        }}
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SimpleRichTextEditor;