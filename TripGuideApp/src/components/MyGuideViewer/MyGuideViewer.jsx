import { useState, useEffect, useRef } from 'react';
import * as I from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import EditGuide from '../EditGuide/EditGuide';
import { toast } from 'react-toastify';
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export default function MyGuideViewer() {
  const { id } = useParams();
  const [guideData, setGuideData] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const accessToken = localStorage.getItem('accessToken');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [activeTab, setActiveTab] = useState('content');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const commentInputRef = useRef(null);
  const [editorModalOpen, setEditorModalOpen] = useState(false);


  const handleLikeClick = async () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
    
    try {
      await likeGuide(id);
    } catch (error) {
      console.error(error);
      setLiked(liked);
      setLikeCount(liked ? likeCount : likeCount - 1);
    }
  };

  const handleCommentLikeClick = (commentId) => async () => {
    try {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          const newLikedStatus = !comment.liked_by_user;
          const newLikeCount = newLikedStatus 
            ? (comment.like_count || 0) + 1 
            : (comment.like_count || 0) - 1;
          
          return {
            ...comment,
            liked_by_user: newLikedStatus,
            like_count: newLikeCount >= 0 ? newLikeCount : 0
          };
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              const newLikedStatus = !reply.liked_by_user;
              const newLikeCount = newLikedStatus 
                ? (reply.like_count || 0) + 1 
                : (reply.like_count || 0) - 1;
              
              return {
                ...reply,
                liked_by_user: newLikedStatus,
                like_count: newLikeCount >= 0 ? newLikeCount : 0
              };
            }
            return reply;
          });
          
          return {
            ...comment,
            replies: updatedReplies
          };
        }
        
        return comment;
      });
      
      setComments(updatedComments);
      

      await likeComment(commentId);
      
    } catch (error) {
      console.error( error);

    }
  };


  const likeComment = async (commentId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/comments/like/${commentId}/`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
        setGuideData(response.data.guide);
        setLiked(response.data.guide.liked_by_user);
        setComments(response.data.discussion || []); 
      })  
      .catch(error => {
        console.error( error);
      });
  }, [id, accessToken]); 

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {

      const commentData = {
        guide_id: id,
        text: newComment,
        parent_id: replyTo
      };
      

      const tempNewComment = {
        id: Date.now(), 
        author: userData.nickname,
        text: newComment,
        created_at: new Date().toISOString(),
        parent_id: replyTo,
        replies: [],
        like_count: 0,
        liked_by_user: false
      };
      

      console.log(tempNewComment)
      if (replyTo) {

        setComments(comments.map(comment => {
          if (comment.id === replyTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), tempNewComment]
            };
          }
          return comment;
        }));
      } else {

        setComments([...comments, tempNewComment]);
      }
      

      setNewComment('');
      setReplyTo(null);

      const response = await axios.post(
        `http://localhost:8000/comments/add`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      console.log( response.data, tempNewComment);
      

    } catch (error) {
      console.error( error);
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const cancelReply = () => {
    setReplyTo(null);
  };
  
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
  
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    setLikeCount(guideData.likes_count);
  }, [guideData.likes_count]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date';
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error( dateString);
      return 'Invalid date';
    }
  
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    return formatter.format(date);
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours());
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
  
  const handleDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      await axios.delete(`http://localhost:8000/guide/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      

      toast.success('Guide deleted successfully!', toastConfig);
      
      
      setTimeout(() => {
        window.location.href = '/profile';
      }, 5000); 
      
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error('Failed to delete guide. Please try again.', toastConfig);
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
                    aria-label={liked ? "Delete like" : "Set like"}
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
                    onClick={handleDelete}
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
              <h2 className="discussions-title">Comments</h2>
              
              <div className="comment-form">
                {replyTo && (
                  <div className="reply-indicator">
                    <span>Reply to comment #{replyTo}</span>
                    <button className="cancel-reply-button" onClick={cancelReply}>
                      <I.X size={16} />
                    </button>
                  </div>
                )}
                <textarea
                  ref={commentInputRef}
                  className="comment-input"
                  placeholder={replyTo ? "Write your reply..." : "Write your comment..."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button className="submit-comment-button" onClick={handleAddComment}>
                  {replyTo ? "Reply" : "Commenting"}
                </button>
              </div>
              
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-thread">
                      <div className="comment">
                        <div className="comment-avatar">
                          <img src={`http://localhost:8000/user/avatar/${comment.author}`} alt={`${comment.author} avatar`} />
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-author">{comment.author}</span>
                            <span className="comment-date">{formatTime(comment.created_at)}</span>
                          </div>
                          <div className="comment-text">{comment.text}</div>
                          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                            <button className="reply-button" onClick={() => handleReply(comment.id)}>
                              <I.Reply size={16} /> Reply
                            </button>
                            <button 
                              className={`com-like-button ${comment.liked_by_user ? 'liked' : ''}`}
                              onClick={handleCommentLikeClick(comment.id)}
                              aria-label={comment.liked_by_user ? "Убрать лайк" : "Поставить лайк"}
                            >
                              {comment.liked_by_user ? <I.Heart fill="red" color="red" /> : <I.Heart />}
                              <span className="like-count">{comment.like_count || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="comment-replies">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="comment reply">
                              <div className="comment-avatar">
                                <img src={`http://localhost:8000/user/avatar/${reply.author}`} alt={`${reply.author} avatar`} />
                              </div>
                              <div className="comment-content">
                                <div className="comment-header">
                                  <span className="comment-author">{reply.author}</span>
                                  <span className="comment-date">{formatTime(reply.created_at)}</span>
                                </div>
                                <div className="comment-text">{reply.text}</div>
                                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                  <button 
                                    className={`com-like-button ${reply.liked_by_user ? 'liked' : ''}`}
                                    onClick={handleCommentLikeClick(reply.id)}
                                    aria-label={reply.liked_by_user ? "Delete like" : "Set like"}
                                  >
                                    {reply.liked_by_user ? <I.Heart fill="red" color="red" /> : <I.Heart />}
                                    <span className="like-count">{reply.like_count || 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-comments">
                    <p>No comments yet. Be the first!</p>
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