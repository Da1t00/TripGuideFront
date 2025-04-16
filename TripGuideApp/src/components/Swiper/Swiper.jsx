// Swiper.jsx
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import GuideBannerSlide from '../Guide/Guide'
import './Swiper.css'
// import required modules
import { Navigation, Autoplay, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { useState, useEffect } from 'react';

const slidesData = [
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Алексей Смирнов',
    title: 'Уикенд в Париже',
    description: 'Посетите Эйфелеву башню, попробуйте круассаны и прогуляйтесь по Монмартру.',
    date: '12 апреля 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Анастасия Романова',
    title: 'Погружение в Бали',
    description: 'Рай для серферов и йогов. Тёплое море, рисовые террасы и закаты.',
    date: '9 апреля 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Олег Кузнецов',
    title: 'Исландия: огонь и лёд',
    description: 'Водопады, вулканы и северное сияние. Пейзажи, от которых захватывает дух.',
    date: '5 апреля 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Юлия Михайлова',
    title: 'Весна в Киото',
    description: 'Цветущая сакура, древние храмы и японская культура в каждом шаге.',
    date: '1 апреля 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Иван Захаров',
    title: 'Сокровища Египта',
    description: 'Пирамиды Гизы, Нил и загадки древней цивилизации.',
    date: '28 марта 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Марина Орлова',
    title: 'Фьорды Норвегии',
    description: 'Путешествие на каяке среди скал, водопадов и северной природы.',
    date: '25 марта 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Андрей Гусев',
    title: '48 часов в Нью-Йорке',
    description: 'Таймс-сквер, Бруклин, Статуя Свободы и уличная еда на каждом углу.',
    date: '22 марта 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Катя Лебедева',
    title: 'Амальфитанское побережье',
    description: 'Итальянская мечта: лимоны, море и романтика маленьких городков.',
    date: '18 марта 2025',
  },
  {
    bgImage: '/images.jpg',
    avatar: '/images.jpg',
    author: 'Дмитрий Соловьёв',
    title: 'Тайны Мачу-Пикчу',
    description: 'След древних инков в горах Перу. Поход, который не забудется.',
    date: '15 марта 2025',
  },
];

export default function SwiperBanner() {
  const [slidesPerView, setSlidesPerView] = useState(1);
  
  // Adjust slides per view based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setSlidesPerView(1);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(1);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{paddingBottom: "50px"}}>
      <h2 className='title'>Best Guides</h2>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={20}
        loop={true}
        speed={2000}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        mousewheel={true}
        keyboard={true}
        modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <GuideBannerSlide
              bgImage={slide.bgImage}
              avatar={slide.avatar}
              author={slide.author}
              title={slide.title}
              description={slide.description}
              date={slide.date}
              onButtonClick={() => alert(`Переход к посту: ${slide.title}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}