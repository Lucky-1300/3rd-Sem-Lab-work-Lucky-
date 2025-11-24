import React from "react";

export default function Sidebar({ posts, onSelect, onCreate, onDelete, onRemoveAll }) {
  return (
    <div className="sidebar">
      <button className="btn-primary" onClick={onCreate}>
        + New Post
      </button>

      {posts.length > 0 && (
        <button className="btn-danger" onClick={onRemoveAll}>
          Remove All
        </button>
      )}

      <div style={{ marginTop: "20px" }}>
        {posts.map((p) => (
          <div
            key={p.id}
            className="card"
            onClick={() => onSelect(p.id)}
            style={{ cursor: "pointer" }}
          >
            <h4>{p.title || "Untitled"}</h4>
            <p style={{ fontSize: "12px", opacity: 0.7 }}>by {p.author || "Unknown"}</p>

            <button
              className="btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(p.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
