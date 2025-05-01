import { useState, useEffect } from 'react';
import './EditGuide.css';
import * as I from 'lucide-react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import axios from 'axios';
 
const mdParser = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: true,
});

export default function EditGuide({ isOpen, onClose, guide, id}) {
  const [markdown_text, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (isOpen) {
      setDescription(guide.description);
      setContent(guide.markdown_text);
      setTitle(guide.title);
    }
  }, [isOpen, guide]);
  

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

  const uploadImageToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('http://localhost:8000/guide/guide_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.image_url;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  const handleImageUpload = async (file) => {
    try {
      const imageUrl = await uploadImageToServer(file);
      
      if (imageUrl) {
        return imageUrl;
      }
      

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  };




  const handleSaveContent = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();
  
    formData.append('title', title);
    formData.append('description', description);
    formData.append('markdown_text', markdown_text);
  
    try {
      await axios.put(`http://localhost:8000/guide/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      });

    } catch (error) {
      console.error( error.response?.data || error.message);

    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }
    handleSaveContent();
    
    onClose();
    window.location.href = `/catalog/my_guide/${id}`;
  };

  

  if (!isOpen) return null;

  return (
    <>
      <div className="editorModalOverlay" onClick={onClose}></div>
      <div className="editorModal">
        <div className="editorModalHeader">
          <h2>{isMobile ? 'New Post' : 'Edit Post'}</h2>
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
              maxLength="80"
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
              maxLength="300"

              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter post description"
              className="descriptionInput"
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
                'font-strikethrough',
                'block-wrap',
                'link',
                'image',
                'clear',
                'logger',
                'mode-toggle',
                'full-screen'
              ]}
              value={markdown_text}
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
              Edit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}