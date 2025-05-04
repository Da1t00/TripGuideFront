import { useState, useEffect } from 'react';
import './EditGuide.css';
import * as I from 'lucide-react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';
 
const mdParser = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: true,
});

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export default function EditGuide({ isOpen, onClose, guide, id}) {
  const [markdown_text, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDescription(guide.description);
      setContent(guide.markdown_text);
      setTitle(guide.title);
      setIsSubmitting(false);
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
      toast.error('Failed to upload image. Please try again.', toastConfig);
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
      toast.error('Failed to process image. Please try again.', toastConfig);
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
      
      toast.success('Guide successfully updated!', {
        ...toastConfig,
        autoClose: 5000
      });
      
      return true;
    } catch (error) {
      console.error(error.response?.data || error.message);
      
      toast.error(error.response?.data?.detail || 'Failed to update guide. Please try again.', {
        ...toastConfig,
        autoClose: 5000
      });
      
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    if (!title.trim()) {
      toast.warning('Title is required', toastConfig);
      return;
    }
    
    if (!description.trim()) {
      toast.warning('Description is required', toastConfig);
      return;
    }
    
    setIsSubmitting(true);
    
    const toastId = toast.info('Updating your guide...', {
      ...toastConfig,
      autoClose: false
    });
    
    const success = await handleSaveContent();
    
    toast.dismiss(toastId);
    
    if (success) {
      onClose();
      

    } else {
      setIsSubmitting(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="editorModalOverlay" onClick={isSubmitting ? null : onClose}></div>
      <div className="editorModal">
        <div className="editorModalHeader">
          <h2>{isMobile ? 'Edit Post' : 'Edit Post'}</h2>
          <button 
            className="closeModalBtn" 
            onClick={onClose} 
            aria-label="Close editor"
            disabled={isSubmitting}
          >
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
            <button 
              type="button" 
              className="cancelBtn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="saveBtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}