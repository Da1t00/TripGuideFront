import './Guide.css';

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

      {/* Контент поверх */}
      <div
        className="card"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div className="avatar"></div>
        <div className="content">
          <div className="description"></div>
          <div className="footer">
            <div>
              Автор
              <br />
              Дата
            </div>
            <div className="arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
}
