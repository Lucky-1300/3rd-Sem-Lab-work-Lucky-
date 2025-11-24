import React from "react";

export default function PostList({ posts, onSelect, onNew, onDelete, onRemoveAll }) {
  return (
    <div className="sidebar">
      <button className="btn-primary" style={{ width: "100%", marginBottom: "12px" }} onClick={onNew}>
        + New Post
      </button>

      {posts.length > 0 && (
        <button className="btn-danger" style={{ width: "100%", marginBottom: "12px" }} onClick={onRemoveAll}>
          Remove All
        </button>
      )}

      {posts.length === 0 && (
        <p style={{ opacity: 0.6, marginTop: "10px" }}>No posts yet</p>
      )}

      {posts.map((post) => (
        <div key={post.id} className="card" onClick={() => onSelect(post.id)}>
          <h4 style={{ fontSize: "16px", fontWeight: 600 }}>
            {post.title || "Untitled"}
          </h4>
          <p style={{ opacity: 0.6, fontSize: "13px", marginTop: "4px" }}>
            by {post.author || "Unknown"}
          </p>

          <button className="btn-danger" style={{ marginTop: "10px" }} onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
