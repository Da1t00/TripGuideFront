
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import GuideBannerSlide from '../Guide/Guide'
import './Swiper.css'
// import required modules
import { Navigation, Autoplay, Pagination, Mousewheel, Keyboard } from 'swiper/modules';


export default function SwiperBanner() {
  return (
    <>
    <Swiper
        cssMode={true}
        navigation={true}
        pagination={{ clickable: true }}
        mousewheel={true}
        keyboard={true}
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        // }}
        modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
    >
      <SwiperSlide>
          <GuideBannerSlide bgImage = {'/images.jpg'} />    
      </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
      <SwiperSlide><GuideBannerSlide bgImage = {'/images.jpg'} />  </SwiperSlide>
    </Swiper>
  </>
  );
}
