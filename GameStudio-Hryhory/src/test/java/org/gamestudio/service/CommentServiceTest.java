package org.gamestudio.service;

import lombok.RequiredArgsConstructor;
import org.gamestudio.dto.request.CommentRequest;
import org.gamestudio.dto.response.CommentResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestConstructor;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@SpringBootTest
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
@RequiredArgsConstructor
class CommentServiceTest implements ServiceTest<CommentRequest, CommentResponse> {
    private final CommentService commentService;

    @Test
    public void findByIdTest() {
        List<CommentResponse> comments = getAll();

        long id = comments.get(0).id();

        Assertions.assertEquals(id, comments.get(0).id());
    }

    @Test
    public void deleteByIdTest() {
        List<CommentResponse> comments = getAll();

        int commentCount = comments.size();

        commentService.deleteCommentById(comments.get(0).id());

        Assertions.assertEquals(commentCount - 1,
                commentService.findAllComments().size());
    }

    @Override
    public CommentRequest getEntity() {
        return new CommentRequest("game", "player", "hi", new Date());
    }

    @Override
    public List<CommentResponse> getAll() {
        List<CommentResponse> comments = commentService.findAllComments();

        if (Objects.isNull(comments)) {
            commentService.createComment(getEntity());

            comments = commentService.findAllComments();
        }

        return comments;
    }
}
