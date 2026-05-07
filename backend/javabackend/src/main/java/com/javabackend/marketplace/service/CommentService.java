package com.javabackend.marketplace.service;
import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.model.Comment;
import com.javabackend.marketplace.repository.CommentRepository;
import com.javabackend.marketplace.model.User;
import com.javabackend.marketplace.repository.UserRepository;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment addComment(Comment comment) {

         String userId = AuthContext.getUserId();

          User user = userRepository.findById(userId)
        .orElseThrow();

       comment.setUserId(userId);
       comment.setUserName(user.getName());
       comment.setCollege(user.getCollege());

        return commentRepository.save(comment);
    }

    public List<Comment> getPostComments(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment likeComment(String id) {

        Comment comment = commentRepository.findById(id)
                .orElseThrow();

        comment.setLikes(comment.getLikes() + 1);

        return commentRepository.save(comment);
    }
}
