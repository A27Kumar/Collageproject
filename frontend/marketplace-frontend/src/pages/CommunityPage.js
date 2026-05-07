import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  MenuItem
} from "@mui/material";
import { jwtDecode } from "jwt-decode";

function CommunityPage() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  const [posts, setPosts] = useState([]);

  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");
  const [trending, setTrending] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const filteredPosts = selectedCategory
  ? posts.filter(
      p => p.category === selectedCategory
    )
  : posts;

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = jwtDecode(token);

    setCity(decoded.city || "");
    setCollege(decoded.college || "");

    fetchPosts(decoded.city, decoded.college);

    API.get("/community/trending")
  .then(res => {
    setTrending(res.data.slice(0, 5));
  });

  }, []);

  const fetchPosts = (city, college) => {

    API.get("/community/nearby", {
      params: { city, college }
    }).then(res => {
      setPosts(res.data);
    });
  };

  const createPost = () => {

    API.post("/community", {
      title,
      content,
      category
    }).then(() => {

      setTitle("");
      setContent("");
      setCategory("General");

      fetchPosts(city, college);
      API.get("/community/trending")
     .then(res => {
    setTrending(res.data.slice(0, 5));
  });
    });
  };

  const likePost = (id) => {

  API.put(`/community/${id}/like`)
    .then(() => {

      fetchPosts(city, college);

      API.get("/community/trending")
        .then(res => {
          setTrending(res.data.slice(0, 5));
        });
    });
   };

  return (
    <Container sx={{ mt: 4 }}>

      <Typography variant="h4">
        Student Community
      </Typography>

      <TextField
        fullWidth
        label="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mt: 2 }}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mt: 2 }}
      />

      <TextField
     select
     fullWidth
     label="Post Category"
     value={category}
     onChange={(e) => setCategory(e.target.value)}
     sx={{ mt: 2 }}
    >
      <MenuItem value="General">General</MenuItem>
      <MenuItem value="Placement">Placement</MenuItem>
      <MenuItem value="Notes">Notes</MenuItem>
      <MenuItem value="Internship">Internship</MenuItem>
      <MenuItem value="Coding">Coding</MenuItem>
      <MenuItem value="College Life">College Life</MenuItem>
    </TextField>

      <TextField
       select
       fullWidth
       label="Filter Category"
       value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{ mt: 3 }}
      >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="General">General</MenuItem>
      <MenuItem value="Placement">Placement</MenuItem>
      <MenuItem value="Notes">Notes</MenuItem>
      <MenuItem value="Internship">Internship</MenuItem>
      <MenuItem value="Coding">Coding</MenuItem>
      <MenuItem value="College Life">College Life</MenuItem>
     </TextField>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={createPost}
      >
        Create Post
      </Button>

        <Typography variant="h5" sx={{ mt: 5 }}>
          Trending Discussions
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>

    {trending.length === 0 ? (

     <Typography sx={{ mt: 2 }}>
       No trending discussions yet
     </Typography>

     ) : trending.map(post => (

    <Grid item xs={12} md={6} key={post.id}>

      <Card
        sx={{
          borderRadius: 3,
          border: "2px solid orange"
        }}
      >

        <CardContent>

          <Typography fontWeight="bold">
            🔥 {post.title}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            {post.content}
          </Typography>

          <Chip
            label={post.category}
            size="small"
            color="warning"
            sx={{ mt: 2 }}
          />

          <Typography sx={{ mt: 2 }}>
            👍 {post.likes}
          </Typography>

          <Button
            size="small"
            sx={{ mt: 1 }}
            onClick={() => likePost(post.id)}
          >
            Like
          </Button>

          <Button
            size="small"
            sx={{ mt: 1 }}
            onClick={() =>
              navigate(`/community/post/${post.id}`)
            }
          >
            View Discussion
          </Button>

           </CardContent>

         </Card>

        </Grid>

        )
        )}

      </Grid>

      <Typography variant="h5" sx={{ mt: 5 }}>
        Nearby Discussions
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>

        {filteredPosts.length === 0 ? (

         <Typography sx={{ mt: 2 }}>
          No discussions found
          </Typography>

        ) : filteredPosts.map(post => (

          <Grid item xs={12} md={6} key={post.id}>

            <Card sx={{ borderRadius: 3 }}>

              <CardContent>

                <Typography fontWeight="bold">
                  {post.title}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  {post.content}
                </Typography>

                <Chip
                  label={post.category}
                  size="small"
                  color="primary"
                  sx={{ mt: 2 }}
                />

                <Typography sx={{ mt: 2 }}>
                  👍 {post.likes}
                </Typography>

                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => likePost(post.id)}
                >
                  Like
                </Button>

                <Button
                 size="small"
                 sx={{ mt: 1 }}
                 onClick={() => navigate(`/community/post/${post.id}`)}
                 >
                View Discussion
                </Button>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

    </Container>
  );
}

export default CommunityPage;