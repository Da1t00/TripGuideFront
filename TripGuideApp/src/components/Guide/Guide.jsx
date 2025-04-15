import './Guide.css';
import GuideBanner from './GuideInfo/GuideBanner';

export default function GuideBannerSlide(props) {
  return (
    <div         className="GuideBannerDiv" style={{ position: "relative", height: "60vh",width:"100vh", overflow: "hidden" }}>
      {/* Размытый фон */}
      <div
        style={{
          backgroundImage: `url(${props.bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", // или "contain"
          backgroundPosition: "center",
          position: "absolute", // ВАЖНО!
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: "blur(5px)",
          zIndex: 0,
        }}
      />
        <GuideBanner
        avatar={props.avatar}
        author={props.author}
        title={props.title}
        description={props.description}
        date={props.date}
        onButtonClick={props.onButtonClick}
      />
    </div>
  );
}
