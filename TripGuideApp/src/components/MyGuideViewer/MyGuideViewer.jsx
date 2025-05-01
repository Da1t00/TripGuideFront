import { useState, useEffect, useRef  } from 'react';
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
  const [activeTab, setActiveTab] = useState('content');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const commentInputRef = useRef(null);

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

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const cancelReply = () => {
    setReplyTo(null);
  };
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // Создаем новый комментарий
      const newCommentData = {
        id: Date.now(), // Временный ID, в реальном приложении будет присваиваться сервером
        user: localStorage.getItem('username') || "CurrentUser",
        avatar: `http://localhost:8000/user/avatar/${localStorage.getItem('username') || "CurrentUser"}`,
        text: newComment,
        created_at: new Date().toISOString(),
        parent_id: replyTo,
        replies: []
      };

      // Пример API вызова для отправки комментария
      // Замените на свой реальный API endpoint
      /* 
      await axios.post(`http://localhost:8000/guide/comments/${id}`, {
        text: newComment,
        parent_id: replyTo
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      */

      // Обновляем локальное состояние комментариев
      if (replyTo) {
        // Добавляем ответ к родительскому комментарию
        setComments(comments.map(comment => {
          if (comment.id === replyTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newCommentData]
            };
          }
          return comment;
        }));
      } else {
        // Добавляем новый комментарий верхнего уровня
        setComments([...comments, newCommentData]);
      }

      // Сбрасываем состояние
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    }
  };
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const formatTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

          <div className="guide-tabs">
          <button 
            className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button 
            className={`tab-button ${activeTab === 'discussions' ? 'active' : ''}`}
            onClick={() => setActiveTab('discussions')}
          >
            Discussions
          </button>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'content' ? (
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
        ) : (
          <div className="discussions-container">
            <h2 className="discussions-title">Комментарии</h2>
            
            {/* Форма для добавления комментария */}
            <div className="comment-form">
              {replyTo && (
                <div className="reply-indicator">
                  <span>Ответ на комментарий #{replyTo}</span>
                  <button className="cancel-reply-button" onClick={cancelReply}>
                    <I.X size={16} />
                  </button>
                </div>
              )}
              <textarea
                ref={commentInputRef}
                className="comment-input"
                placeholder={replyTo ? "Напишите ваш ответ..." : "Напишите ваш комментарий..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button className="submit-comment-button" onClick={handleAddComment}>
                {replyTo ? "Ответить" : "Комментировать"}
              </button>
            </div>
            
            {/* Список комментариев */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="comment-thread">
                    <div className="comment">
                      <div className="comment-avatar">
                        <img src={comment.avatar} alt={`${comment.user} avatar`} />
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.user}</span>
                          <span className="comment-date">{formatTime(comment.created_at)}</span>
                        </div>
                        <div className="comment-text">{comment.text}</div>
                        <button className="reply-button" onClick={() => handleReply(comment.id)}>
                          <I.Reply size={16} /> Ответить
                        </button>
                      </div>
                    </div>
                    
                    {/* Ответы на комментарий */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="comment-replies">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="comment reply">
                            <div className="comment-avatar">
                              <img src={reply.avatar} alt={`${reply.user} avatar`} />
                            </div>
                            <div className="comment-content">
                              <div className="comment-header">
                                <span className="comment-author">{reply.user}</span>
                                <span className="comment-date">{formatTime(reply.created_at)}</span>
                              </div>
                              <div className="comment-text">{reply.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-comments">
                  <p>Пока нет комментариев. Будьте первым!</p>
                </div>
              )}
            </div>
          </div>
        )}
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