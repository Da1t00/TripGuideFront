import axios from './axiosInstance'; // путь может отличаться в зависимости от структуры

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');

    const response = await axios.post('/auth/refresh', {
      token: refreshToken,
      token_type: "refresh" // 👈 правильно!
    });

    const { access_token, refresh_token: new_refresh_token } = response.data;


    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', new_refresh_token);

  } catch (error) {
    console.error('[Token Refresh] Failed:', error);
    // Здесь можно сделать logout, показать сообщение или перекинуть на страницу авторизации
  }
};

export default refreshToken;
