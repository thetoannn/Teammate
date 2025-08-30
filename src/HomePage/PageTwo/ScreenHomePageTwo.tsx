import React, { useState, useEffect, useRef } from "react";
import TrendingPost from "./TrendingPost";
import "../../styles/customHomeScreenTwo.css";
import "../../styles/stackEffect.css";
import Masonry from "react-masonry-css";
import "../../styles/resesPonsive.css";
import "../../styles/largeScreenLayout.css";

const ScreenHomePageTwo = () => {
  const [viewState, setViewState] = useState<
    "stacked" | "unstacked" | "masonry"
  >("stacked");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // For touch devices with larger screens (Surface, Zenbook, Nest Hub Max), use stack effect
      // For mobile phones and tablets, use masonry
      const isTouchLaptop =
        screenWidth >= 1024 &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);

      setIsMobileDevice(
        (isMobile || isTablet || screenWidth < 1024) && !isTouchLaptop
      );
    };

    detectDeviceType();
    window.addEventListener("resize", detectDeviceType);

    return () => window.removeEventListener("resize", detectDeviceType);
  }, []);

  // Generate random view count for each post
  const generateRandomViewCount = () => {
    return Math.floor(Math.random() * 49900) + 100;
  };

  const trendingPosts = [
    {
      imageUrl:
        "https://i.pinimg.com/736x/59/f2/8e/59f28ef58618d16c02789d445803c3cf.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://framerusercontent.com/images/B60O9vU08hbFOWfqaBn5nZAR8.png",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://image.msscdn.net/thumbnails/images/goods_img/20250220/4809675/4809675_17421897309765_big.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://www.creativeboom.com/upload/articles/b0/b0b40a63087a9c1ef723f83c7553a2ddc1a15741_1888.png",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://tse3.mm.bing.net/th?id=OIF.ZRRZ8TPSkhOHYZLRcMaa%2bw&pid=Api&P=0&h=220",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://img.freepik.com/premium-vector/creative-travel-youtube-thumbnail-poster-design_1063714-110.jpg?w=2000",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://img.freepik.com/premium-vector/podcast-youtube-thumbnail-banner-design_543097-18.jpg?w=2000",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://rocketshipcreative.com/wp-content/uploads/2023/06/Portfolio_Thumbnails-SAP-Marketing-Cloud.png",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://assets-global.website-files.com/62b48d9033eee452dce0e967/65e98edc263a7675fcb51633_ai-thumbnail-generator.webp",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/b4/ad/b8/b4adb8aa723810fead1dc903933e3557.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/05/7f/1e/057f1ebf66cde5c5544ed1f9acf7dbb0.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/87/80/de/8780dee425b04c421e5d116f6ddde93f.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/12/3d/1c/123d1c75513e5a9001f62ff7ae763e56.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/c8/fb/41/c8fb41749423077c818b42c5644ef1e2.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/01/5f/2d/015f2d34dd6ee67a37a03c25fec2f107.jpg",
      category: "Research AI",
      title: "Phân tích xu hướng CTA hiệu quả nhất 2024",
      viewCount: generateRandomViewCount(),
    },
  ];

  useEffect(() => {
    if (!containerRef.current || isMobileDevice) return;

    let transitionTimeout: number;
    let isInitialLoad = true;

    // Check screen width and height to determine behavior
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Specific resolution checks for problematic screens - apply 1280x800 logic
    const isProblematicResolution =
      (screenWidth === 1366 && screenHeight === 1024) ||
      (screenWidth === 1600 && screenHeight === 1080) ||
      (screenWidth === 1080 && screenHeight === 1600) ||
      (screenWidth === 1900 && screenHeight === 1080) ||
      (screenWidth === 1080 && screenHeight === 1900) ||
      // High-resolution screens - apply same stable logic
      (screenWidth === 2400 && screenHeight === 1600) ||
      (screenWidth === 2400 && screenHeight === 1200) ||
      (screenWidth === 2560 && screenHeight === 1600) ||
      (screenWidth === 2880 && screenHeight === 1800);

    const isLargeDesktop = screenWidth >= 1080 || isProblematicResolution; // 1080px and above should have full stack effect (covers 1366x1024, 1600x1080, 1900x1080, and 1080x1600 in landscape)
    const isMediumDesktop =
      screenWidth >= 768 && screenWidth < 1080 && !isProblematicResolution; // Smaller tablets get limited stack

    // Add a delay to prevent immediate state changes on page load
    const initialLoadDelay = setTimeout(() => {
      isInitialLoad = false;
    }, 1000); // 1 second delay to allow page to settle

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scrollProgress = entry.intersectionRatio;

          // Skip state changes during initial load to prevent immediate transitions
          if (isInitialLoad) {
            return;
          }

          if (transitionTimeout) {
            clearTimeout(transitionTimeout);
          }

          if (entry.isIntersecting) {
            if (isLargeDesktop) {
              if (isProblematicResolution) {
                if (scrollProgress > 0.6) {
                  if (viewState !== "unstacked") {
                    transitionTimeout = setTimeout(
                      () => setViewState("unstacked"),
                      200
                    );
                  }
                } else if (scrollProgress <= 0.3) {
                  if (viewState !== "stacked") {
                    transitionTimeout = setTimeout(
                      () => setViewState("stacked"),
                      200
                    );
                  }
                }
              } else {
                if (scrollProgress > 0.8) {
                  if (viewState !== "masonry") {
                    transitionTimeout = setTimeout(
                      () => setViewState("masonry"),
                      300
                    );
                  }
                } else if (scrollProgress > 0.4) {
                  if (viewState !== "unstacked") {
                    transitionTimeout = setTimeout(
                      () => setViewState("unstacked"),
                      100
                    );
                  }
                } else if (scrollProgress > 0.1) {
                  if (viewState !== "stacked") {
                    transitionTimeout = setTimeout(
                      () => setViewState("stacked"),
                      100
                    );
                  }
                }
              }
            } else if (isMediumDesktop) {
              if (scrollProgress > 0.4) {
                if (viewState !== "unstacked") {
                  transitionTimeout = setTimeout(
                    () => setViewState("unstacked"),
                    100
                  );
                }
              } else if (scrollProgress > 0.1) {
                if (viewState !== "stacked") {
                  transitionTimeout = setTimeout(
                    () => setViewState("stacked"),
                    100
                  );
                }
              }
            } else {
              if (scrollProgress > 0.8) {
                if (viewState !== "masonry") {
                  transitionTimeout = setTimeout(
                    () => setViewState("masonry"),
                    300
                  );
                }
              } else if (scrollProgress > 0.4) {
                if (viewState !== "unstacked") {
                  transitionTimeout = setTimeout(
                    () => setViewState("unstacked"),
                    100
                  );
                }
              } else if (scrollProgress > 0.1) {
                if (viewState !== "stacked") {
                  transitionTimeout = setTimeout(
                    () => setViewState("stacked"),
                    100
                  );
                }
              }
            }
          } else {
            if (!isInitialLoad && viewState !== "stacked") {
              transitionTimeout = setTimeout(
                () => setViewState("stacked"),
                200
              );
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-100px 0px -100px 0px",
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
      }
      if (initialLoadDelay) {
        clearTimeout(initialLoadDelay);
      }
    };
  }, [viewState, isMobileDevice]);

  const breakpointColumnsObj = {
    default: 4,
    2880: 5,
    2560: 5,
    2400: 5,
    1900: 5,
    1600: 5,
    1440: 5,
    1366: 4,
    1300: 4,
    1280: 4,
    1200: 3,
    1100: 3,
    1080: 3,
    1024: 3,
    932: 3,
    900: 3,
    768: 3,
    720: 3,
    667: 3,
    500: 3,
    430: 3,
    414: 3,
    390: 3,
    375: 3,
    360: 3,
    340: 3,
  };

  // Prepare posts data
  const postsData = trendingPosts.map((post, index) => ({
    ...post,
    linkUrl:
      index === 0
        ? "https://www.pinterest.com/pin/3377768468159719/"
        : index === 1
        ? "https://www.pinterest.com/pin/2674081025477864/"
        : "#",
  }));

  const groupedPosts = [];
  for (let i = 0; i < postsData.length; i += 5) {
    groupedPosts.push(postsData.slice(i, i + 5));
  }

  const renderStackLine = (linePosts: typeof postsData, lineIndex: number) => {
    const paddedPosts = [...linePosts];
    while (paddedPosts.length < 5) {
      paddedPosts.push(null as any);
    }

    return (
      <div
        key={lineIndex}
        className={`stack-line ${viewState === "stacked" ? "stacked" : ""}`}
      >
        {paddedPosts.map((post, postIndex) => {
          if (!post) {
            return (
              <div
                key={postIndex}
                className={`stack-item position-${postIndex}`}
                style={{ visibility: "hidden" }}
              />
            );
          }

          return (
            <div
              key={postIndex}
              className={`stack-item position-${postIndex}`}
              style={{
                transitionDelay: `${postIndex * 0.05}s`,
              }}
            >
              <div className="stack-item-content ">
                <TrendingPost
                  imageUrl={post.imageUrl}
                  category={post.category}
                  title={post.title}
                  viewCount={post.viewCount}
                  linkUrl={post.linkUrl || "#"}
                  isInStack={viewState !== "masonry"}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row"
      style={{ overflow: "hidden" }}
    >
      <div
        className="flex flex-col flex-1 min-h-screen custom-ipad-hehe screen-home-page-two-container"
        style={{
          overflow: "hidden",
          position: "relative",
          marginTop: isMobileDevice ? "20px" : "0px",
          paddingTop: isMobileDevice ? "20px" : "0px",
        }}
      >
        {/* Stack Effect for Touch Laptops */}
        {!isMobileDevice && (
          <>
            {/* Stack Effect Container - Always visible for problematic resolutions, conditionally visible for others */}
            <div
              className="stack-container gap-1"
              style={{
                opacity: viewState === "masonry" ? 0 : 1,
                transform:
                  viewState === "masonry"
                    ? "translateY(20px)"
                    : "translateY(0)",
                transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: viewState === "masonry" ? "absolute" : "relative",
                zIndex: viewState === "masonry" ? 0 : 1,
                width: "100%",
                display: "block", // Ensure stack effect is always available
              }}
            >
              {groupedPosts.map((linePosts, lineIndex) =>
                renderStackLine(linePosts, lineIndex)
              )}
            </div>

            {/* Masonry Grid Container - Hidden for problematic resolutions to prevent blinking */}
            <div
              style={{
                opacity: viewState === "masonry" ? 1 : 0,
                transform:
                  viewState === "masonry"
                    ? "translateY(0)"
                    : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: viewState === "masonry" ? "relative" : "absolute",
                zIndex: viewState === "masonry" ? 1 : 0,
                width: "100%",
                // Hide masonry for problematic resolutions to prevent blinking
                display: (() => {
                  const screenWidth = window.innerWidth;
                  const screenHeight = window.innerHeight;
                  const isProblematic =
                    (screenWidth === 1366 && screenHeight === 1024) ||
                    (screenWidth === 1600 && screenHeight === 1080) ||
                    (screenWidth === 1080 && screenHeight === 1600) ||
                    (screenWidth === 1900 && screenHeight === 1080) ||
                    (screenWidth === 1080 && screenHeight === 1900) ||
                    // High-resolution screens - also hide masonry to prevent blinking
                    (screenWidth === 2400 && screenHeight === 1600) ||
                    (screenWidth === 2400 && screenHeight === 1200) ||
                    (screenWidth === 2560 && screenHeight === 1600) ||
                    (screenWidth === 2880 && screenHeight === 1800);
                  return isProblematic ? "none" : "block";
                })(),
              }}
            >
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                data-masonry-active={viewState === "masonry" ? "true" : "false"}
              >
                {postsData.map((post, index) => (
                  <div key={index}>
                    <TrendingPost
                      imageUrl={post.imageUrl}
                      category={post.category}
                      title={post.title}
                      viewCount={post.viewCount}
                      linkUrl={post.linkUrl}
                      isInStack={false}
                    />
                  </div>
                ))}
              </Masonry>
            </div>
          </>
        )}

        {isMobileDevice && (
          <div
            className="mobile-masonry-container"
            style={{
              width: "100%",
              position: "relative",
              paddingTop: "10px",
            }}
          >
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid mobile-masonry-grid"
              columnClassName="my-masonry-grid_column"
              data-masonry-active="true"
            >
              {postsData.map((post, index) => (
                <div key={index}>
                  <TrendingPost
                    imageUrl={post.imageUrl}
                    category={post.category}
                    title={post.title}
                    viewCount={post.viewCount}
                    linkUrl={post.linkUrl}
                    isInStack={false}
                  />
                </div>
              ))}
            </Masonry>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenHomePageTwo;
