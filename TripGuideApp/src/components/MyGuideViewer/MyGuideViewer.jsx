import { useState, useEffect } from 'react';
import * as I from 'lucide-react';
import EditGuide from '../EditGuide/EditGuide';
// Import a markdown parser library (you would need to install this)
import Markdown from 'markdown-to-jsx';
import {useParams} from 'react-router-dom';
import axios from 'axios';

export default function GuideViewer() {
  const { id } = useParams();
  const [guideData, setGuideData] = useState([]);
  const [liked, setLiked] = useState(guideData.liked_by_user);
  const [likeCount, setLikeCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const accessToken = localStorage.getItem('accessToken');
  const [editorModalOpen, setEditorModalOpen] = useState(false);


  const handleLikeClick = async () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      try {
          await likeGuide(id); 
      } catch (error) {
        console.error('Ошибка при лайке:', error);
      }
    } else {
      setLikeCount(likeCount + 1);
      try {
        await likeGuide(id);
      } catch (error) {
        console.error('Ошибка при лайке:', error);
      }
    }
    setLiked(!liked);
    console.log(guideData);
  };


  useEffect(() => {
    axios.get(`http://localhost:8000/guide/read_guide/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
     )
      .then(response => {
        console.log('Ответ от сервера:', response.data);
        setGuideData(response.data);
        setLiked(response.data.liked_by_user);
      })  
      .catch(error => {
        console.log('Ответ от сервера:', error.response.data);
        console.error('Ошибка при получении каталога:', error);
      });
  }, [id,accessToken]); 

 
  
  const getEditorHeight = () => {
    if (windowWidth <= 480) return '400px';
    if (windowWidth <= 768) return '500px';
    return '600px';
  };
  const likeGuide = async (guideId) => {
    try {
      
  
      const response = await axios.post(`http://localhost:8000/guide/like/${guideId}/`, {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log('Ответ от сервера:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке лайка:', error);
      throw error;
    }
  };

  useEffect(() => {
    setLikeCount(guideData.likes_count);
  }, [guideData.likes_count]);
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openEditorModal = () => {
    setEditorModalOpen(true);
};
const handledelete = async () => {
  const accessToken = localStorage.getItem('accessToken');
  

  try {
    await axios.delete(`http://localhost:8000/guide/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    alert('Guide delete successfully!');
    window.location.href = '/profile'; // Redirect to the profile page after deletion
  } catch (error) {
    console.error('Error edit guide:', error.response?.data || error.message);
    alert('Error edit guide!');
  }
};

  return (
    <>
      <div className="guide-viewer-container">
        <div className="guide-viewer">
          <div className="guide-header">
          <div className="guide-logo-container">
            <img 
              src={`http://localhost:8000/guide/get_guide_logo/${id}`} 
              alt={`Превью для ${guideData.title}`} 
              className="guide-logo" 
            />
            <div className="guide-author-info">
              <div className="author-avatar">
                <img 
                  src={`http://localhost:8000/user/avatar/${guideData.author}`} 
                  alt={`Аватар ${guideData.author}`} 
                />
              </div>
              <div className="author-details">
                <div className="author-name">{guideData.author}</div>
                <div className="guide-date">{formatDate(guideData.created_at)}</div>
              </div>
            </div>
          </div>
            
            <div className="guide-meta">
              <div className='guide-title-container'> 
                <h1 className="guide-title">{guideData.title}</h1>
                <p className="guide-description">{guideData.description}</p>
              </div>
              <div className="guide-stats">
              <div className="guide-tags">
              {Array.isArray(guideData.tags) && guideData.tags.map((tag, index) => (
                <span key={index} className="guide-tag">{tag}</span>
              ))}
              </div>
              <div className="guide-buttons-container">
                <button 
                    className={`like-button ${liked ? 'liked' : ''}`}
                    onClick={handleLikeClick}
                    aria-label={liked ? "Убрать лайк" : "Поставить лайк"}
                  >
                    {liked ? <I.Heart fill="red" color="red" /> : <I.Heart />}
                    <span className="like-count">{likeCount}</span>
                  </button>
                  <button 
                    className={`edit-button`}
                    onClick={openEditorModal}
                  >
                    <I.Pencil color='black' />
                  </button>
                  <button 
                    className={`edit-button`}
                    onClick={handledelete}
                  >
                    <I.Trash2 color='black' />
                  </button>
                </div>
            </div>
            </div>
          </div>

          <div className="guide-content">
            <div 
              className="markdown-container" 
              style={{ 
                height: getEditorHeight(),
                overflow: 'auto',
                padding: '20px'
              }}
            >
              <Markdown>{guideData.markdown_text}</Markdown>
            </div>
          </div>
        </div>
      </div>
      <EditGuide
      isOpen={editorModalOpen} 
      onClose={() => setEditorModalOpen(false)}
      guide={guideData}
      id={id}
      />
  </>
  );
}