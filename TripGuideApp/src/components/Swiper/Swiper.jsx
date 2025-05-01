import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import GuideBannerSlide from '../Guide/Guide'
import './Swiper.css'
import { Navigation, Autoplay, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function SwiperBanner() {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [slidesData, setSlidesData] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setSlidesPerView(1);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(1);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    axios.get('http://localhost:8000/popular')
      .then(response => {
        setSlidesData(response.data.guides);
      })
      .catch(error => {
        console.error( error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
              bgImage={slide.id}
              author={slide.author}
              title={slide.title}
              description={slide.description}
              date={formatDate(slide.created_at)}
              onButtonClick={() => navigate(`/catalog/view_guide/${slide.id}`, { state: { slide } })}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}