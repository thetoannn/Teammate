import React from "react";
import TrendingPost from "./TrendingPost";
import "../../styles/stackEffect.css";

interface StackEffectProps {
  posts: Array<{
    imageUrl: string;
    category: string;
    title: string;
    viewCount: number;
    linkUrl?: string;
  }>;
  isStacked: boolean;
}

const StackEffect: React.FC<StackEffectProps> = ({ posts, isStacked }) => {
  const groupedPosts = [];
  for (let i = 0; i < posts.length; i += 5) {
    groupedPosts.push(posts.slice(i, i + 5));
  }

  const renderStackLine = (linePosts: typeof posts, lineIndex: number) => {
    const paddedPosts = [...linePosts];
    while (paddedPosts.length < 5) {
      paddedPosts.push(null as any);
    }

    return (
      <div
        key={lineIndex}
        className={`stack-line ${isStacked ? "stacked" : ""}`}
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
              <div className="stack-item-content">
                <TrendingPost
                  imageUrl={post.imageUrl}
                  category={post.category}
                  title={post.title}
                  viewCount={post.viewCount}
                  linkUrl={post.linkUrl || "#"}
                  isInStack={true}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="stack-container">
      {groupedPosts.map((linePosts, lineIndex) =>
        renderStackLine(linePosts, lineIndex)
      )}
    </div>
  );
};

export default StackEffect;
