package com.javabackend.marketplace.controller;
import com.javabackend.marketplace.model.Comment;
import com.javabackend.marketplace.service.CommentService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }

    @GetMapping("/{postId}")
    public List<Comment> getComments(
            @PathVariable String postId) {

        return commentService.getPostComments(postId);
    }

    @PutMapping("/{id}/like")
    public Comment likeComment(@PathVariable String id) {
        return commentService.likeComment(id);
    }
}