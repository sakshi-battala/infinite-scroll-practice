import { useEffect, useRef, useState } from "react";

const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const loadingRef = useRef(null);

  const [initialPageLoad, setInitialPageLoad] = useState(true);

  const loadImages = async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${page}&&per_page=10&&client_id=${import.meta.env.VITE_CLIENT_ID}`,
    );
    const data = await response.json();
    setImages([...images, ...data]);
    setInitialPageLoad(false);
  };

  useEffect(() => {
    loadImages();
  }, [page]);

  useEffect(() => {
    if (!loadingRef.current) return;

    const loadingObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !initialPageLoad) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    loadingObserver.observe(loadingRef.current);

    return () => {
      if (loadingRef.current) {
        loadingObserver.unobserve(loadingRef.current);
      }
    };
  }, [images]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Infinite Scrolling</h2>

      <div>
        {images.map((image) => {
          return (
            <img
              style={{
                display: "block",
                margin: "10px auto",
                width: "50%",
                height: "400px",
                objectFit: "cover",
              }}
              key={image.id}
              src={image.urls.regular}
              alt={image.alt_description}
            />
          );
        })}
      </div>

      <div ref={loadingRef}>Loading...</div>
    </div>
  );
};

export default App;
