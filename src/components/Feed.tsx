import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feed.css";

interface Post {
  id: number;
  username: string;
  content: string;
  createdAt: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Função para buscar postagens
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(response.data);
    } catch (err) {
      setError("Erro ao buscar postagens");
      console.error("Erro ao buscar postagens:", err);
    }
  };

  // Função para criar nova postagem
  const handlePostSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/posts",
        { content: newPostText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Atualiza a lista de postagens
      fetchPosts();
      setNewPostText("");
    } catch (err) {
      setError("Erro ao criar postagem");
      console.error("Erro ao criar postagem:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      <div className="new-post">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
        />
        <button onClick={handlePostSubmit}>Postar</button>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.username}</h3>
          <p>{post.content}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Feed;
