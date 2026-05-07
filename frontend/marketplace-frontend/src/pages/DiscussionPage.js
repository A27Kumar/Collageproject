import React, { useEffect, useState } from "react";
import API from "../services/api";

import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Box,
  Chip
} from "@mui/material";

import { useParams } from "react-router-dom";

function DiscussionPage() {

  const { id } = useParams();

  const [post, setPost] = useState(null);

  const [comments, setComments] = useState([]);

  const [content, setContent] = useState("");

  const [replyInputs, setReplyInputs] = useState({});

  useEffect(() => {

    fetchPost();
    fetchComments();

  }, []);

  const fetchPost = () => {

    API.get(`/community/post/${id}`)
      .then(res => {
        setPost(res.data);
      });
  };

  const fetchComments = () => {

    API.get(`/comments/${id}`)
      .then(res => {
        setComments(res.data);
      });
  };

  // 🔥 Add main comment
  const addComment = () => {

    if (!content) return;

    API.post("/comments", {
      postId: id,
      content
    }).then(() => {

      setContent("");

      fetchComments();
    });
  };

  // 🔥 Add reply
  const addReply = (parentCommentId) => {

    const reply = replyInputs[parentCommentId];

    if (!reply) return;

    API.post("/comments", {
      postId: id,
      parentCommentId,
      content: reply
    }).then(() => {

      setReplyInputs({
        ...replyInputs,
        [parentCommentId]: ""
      });

      fetchComments();
    });
  };

  // 🔥 Like comment
  const likeComment = (commentId) => {

    API.put(`/comments/${commentId}/like`)
      .then(() => fetchComments());
  };

  // 🔥 Share discussion
  const shareDiscussion = () => {

    navigator.clipboard.writeText(window.location.href);

    alert("Discussion link copied!");
  };

  // 🔥 Main comments only
  const mainComments = comments.filter(
    c => !c.parentCommentId
  );

  // 🔥 Replies
  const getReplies = (parentId) => {
    return comments.filter(
      c => c.parentCommentId === parentId
    );
  };

  return (
    <Container sx={{ mt: 4 }}>

      {/* 🔥 POST */}
      {post && (

        <Card sx={{ borderRadius: 3, mb: 4 }}>

          <CardContent>

            <Typography variant="h5" fontWeight="bold">
              {post.title}
            </Typography>

            <Typography sx={{ mt: 2 }}>
              {post.content}
            </Typography>

            <Chip
              label={post.category}
              sx={{ mt: 2 }}
            />

            <Typography sx={{ mt: 2 }}>
              👍 {post.likes}
            </Typography>

            <Button
              sx={{ mt: 2 }}
              onClick={shareDiscussion}
            >
              Share Discussion
            </Button>

          </CardContent>

        </Card>
      )}

      {/* 🔥 COMMENT INPUT */}
      <Typography variant="h6">
        Add Comment
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={addComment}
      >
        Comment
      </Button>

      {/* 🔥 COMMENTS */}
      <Typography variant="h5" sx={{ mt: 5 }}>
        Discussion
      </Typography>

      {mainComments.map(comment => (

        <Card
          key={comment.id}
          sx={{ mt: 3, borderRadius: 3 }}
        >

          <CardContent>

            <Typography fontWeight="bold">
             {comment.userName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
             {comment.college}
            </Typography>

            <Typography>
              {comment.content}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              👍 {comment.likes}
            </Typography>

            <Button
              size="small"
              onClick={() => likeComment(comment.id)}
            >
              Like
            </Button>

            {/* 🔥 REPLY INPUT */}
            <Box sx={{ mt: 2 }}>

              <TextField
                fullWidth
                size="small"
                placeholder="Reply..."
                value={replyInputs[comment.id] || ""}
                onChange={(e) =>
                  setReplyInputs({
                    ...replyInputs,
                    [comment.id]: e.target.value
                  })
                }
              />

              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={() => addReply(comment.id)}
              >
                Reply
              </Button>

            </Box>

            {/* 🔥 REPLIES */}
            <Box sx={{ ml: 4, mt: 3 }}>

              {getReplies(comment.id).map(reply => (

                <Box
                  key={reply.id}
                  sx={{
                    borderLeft: "2px solid #ccc",
                    pl: 2,
                    mt: 2
                  }}
                >

                  <Typography>
                    {reply.content}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    👍 {reply.likes}
                  </Typography>

                  <Button
                    size="small"
                    onClick={() => likeComment(reply.id)}
                  >
                    Like
                  </Button>

                </Box>

              ))}

            </Box>

          </CardContent>

        </Card>

      ))}

    </Container>
  );
}

export default DiscussionPage;