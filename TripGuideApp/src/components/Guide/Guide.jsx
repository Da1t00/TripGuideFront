import './Guide.css';
import GuideBanner from './GuideInfo/GuideBanner';

export default function GuideBannerSlide(props) {
  return (
    <div className="GuideBannerDiv">
      <div
        style={{
          backgroundImage: `url(http://localhost:8000/guide/get_guide_logo/${props.bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: "blur(5px)",
          zIndex: 0,
        }}
      />
      <GuideBanner
        author={props.author}
        title={props.title}
        description={props.description}
        date={props.date}
        onButtonClick={props.onButtonClick}
      />
    </div>
  );
}