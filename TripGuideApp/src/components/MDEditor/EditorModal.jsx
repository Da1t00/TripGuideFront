import { useState, useEffect } from 'react';
import './EditorModal.css';
import * as I from 'lucide-react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};
 
const mdParser = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: true,
});

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";


export default function EditorModal({ isOpen, onClose}) {
  const [markdown_text, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    if (isOpen) {
      setLogoFile('');
      setDescription('');
      setContent('');
      setTitle('');
      setSelectedType('');
      setSelectedCountry('');
      setTags([]);
      setIsDisabled(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);
  

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

  const handleLogoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setLogoFile(selectedFile);
    }
  };



  const handleSaveContent = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();
  
    formData.append('title', title);
    formData.append('description', description);
    formData.append('markdown_text', markdown_text);
  
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    tags.forEach(tag => {
      formData.append('tags', tag);
    });
  
    try {
      const response = await axios.post('http://localhost:8000/guide/save_guide', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      });

      toast.success('Guide successfully published!', {
        ...toastConfig,
        autoClose: 5000 
      });
      
      return response;
    } catch (error) {
      console.error(error.response?.data || error.message);
      
      toast.error(error.response?.data?.detail || 'Failed to publish guide. Please try again.', {
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
    
    if (!logoFile) {
      toast.warning('Logo image is required', toastConfig);
      return;
    }
    
    setIsSubmitting(true);
    
    const toastId = toast.info('Publishing your Guide...', {
      ...toastConfig,
      autoClose: false 
    });
    
    const success = await handleSaveContent();
    
    toast.dismiss(toastId);
    
    if (success) {
     
      onClose();
      setIsSubmitting(false); 
    } else {
      setIsSubmitting(false);
    }
  };

  const [selectedType, setSelectedType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [tags, setTags] = useState([]);
  
  const categories = ["Food", "Trip", "Hotels"];
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(geoUrl);
        const data = await res.json();
        const countryNames = data.features.map(d => d.properties.name);
  
        countryNames.sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load countries list', toastConfig);
      }
    };
    fetchCountries();
  }, []);
  

  const addTypeTag = () => {
    const tag = selectedType;
    if (selectedType && !tags.includes(tag)) {
      setTags([...tags, tag]);      
      setSelectedType('');
    }
    if (tags.length == 5) {
      setIsDisabled(true); 
      toast.info('Maximum 6 tags allowed', {
        ...toastConfig,
        autoClose: 2000
      });
    }
  };

  const addCountryTag = () => {
    const tag = selectedCountry;
    if (selectedCountry && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setSelectedCountry('');

    }
    if (tags.length == 5) {
      setIsDisabled(true); 
      toast.info('Maximum 6 tags allowed', {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setIsDisabled(false);
  };
  

  if (!isOpen) return null;

  return (
    <>
      <div className="editorModalOverlay" onClick={isSubmitting ? null : onClose}></div>
      <div className="editorModal">
        <div className="editorModalHeader">
          <h2>{isMobile ? 'New guide' : 'Create New guide'}</h2>
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
              placeholder="Enter guide title"
              className="titleInput"
              required
            />
            <label>Description</label>
            <textarea
              name="textarea"
              value={description}
              maxLength="300"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter guide description"
              className="descriptionInput"
              required
            />
            <label>Guide logo image</label>
            <input
              type="file"
              id="logoFile"
              onChange={handleLogoChange}
              placeholder="Enter guide logo"
              className="logoInput"
              required
            />
            
            <label>Tags</label>
            <div className="tagInputContainer">
              <div className='tagInputGroup'>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="tagInput"
                >
                  <option value="">Choose type/types of guide</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="addTagBtn"
                  disabled={isDisabled}
                  onClick={addTypeTag}
                >
                  <I.Plus size={12} />
                </button>
              </div>
              <div className='tagInputGroup'>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="tagInput"
                >
                  <option value="">Choose country/countries of guide</option>
                  {countries.filter((country) => country !== "Antarctica").map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="addTagBtn"
                  disabled={isDisabled}
                  onClick={addCountryTag}
                >
                  <I.Plus size={12} />
                </button>
              </div>
            </div>
            
            {tags.length > 0 && (
              <div className="tagsContainer">
                {tags.map((tag, index) => (
                  <div key={index} className="tagItem">
                    <span>{tag}</span>
                    <button 
                      type="button" 
                      className="removeTagBtn" 
                      onClick={() => removeTag(tag)}
                    >
                      <I.X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <button type="button" className="cancelBtn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="saveBtn" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}