import { useState, useEffect } from 'react';
import './EditorModal.css';
import * as I from 'lucide-react';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: false,

})

  

export default function EditorModal({ isOpen, onClose, onSave }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setLogo('');
      setDescription('');
      setContent('');
      setTitle('');
    }
  }, [isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };
  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result;
        resolve(url);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a discription');
      return;
    }
    if (!logo.trim()) {
      alert('Please enter a logo image');
      return;
    }
    
    onSave({
      title,
      description,
      logo,
      content,
      createdAt: new Date().toISOString()
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="editorModalOverlay" onClick={onClose}></div>
      <div className="editorModal">
        <div className="editorModalHeader">
          <h2>{isMobile ? 'New Post' : 'Create New Post'}</h2>
          <button className="closeModalBtn" onClick={onClose} aria-label="Close editor">
            <I.X size={isMobile ? 20 : 24} color="#333" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="editorForm">
          <div className="formGroup">
            <label>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="titleInput"
              required
            />
            <label>Description</label>
            <textarea
            name="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post discription"
            className="descriptionInput"
            required
            />
            <label>Post logo image</label>
            <input
              type="file"
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="Enter post logo"
              className="logoInput"
              required
            />

          </div>
          
          <div className="formGroup editorContainer">
            <label>Content</label>
            <MdEditor
              style={{ height: isMobile ? '300px' : '400px' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              plugins={[
                'header',
                'font-bold',
                'font-underline',
                'font-strikethrough',
                'block-wrap',
                'link',
                'image',
                'clear',
                'logger',
                'mode-toggle',
                'full-screen']}
              value={content}
              config={{
                view: { menu: true, md: true, html: true },
                canView: { menu: true, md: true, html: true, fullScreen: true },
                htmlClass: 'editorHtml',
                markdownClass: 'editorMarkdown'
              }}
              onImageUpload={handleImageUpload}
            />
          </div>
          
          <div className="editorModalFooter">
            <button type="button" className="cancelBtn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="saveBtn">
              Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
}