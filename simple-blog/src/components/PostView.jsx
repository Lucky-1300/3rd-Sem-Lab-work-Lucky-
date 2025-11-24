import React from "react";

export default function PostView({ post, onEdit }) {
  if (!post) return <p className="empty-text">Select a post to view</p>;

  return (
    <div className="content">
      <h2 className="post-title">{post.title}</h2>
      <p className="post-meta">
        by {post.author} on {new Date(post.createdAt).toLocaleString()}
      </p>
      <div className="post-body">{post.body}</div>
      <button className="btn-secondary" onClick={onEdit} style={{ marginTop: "20px" }}>
        Edit
      </button>
    </div>
  );
}
