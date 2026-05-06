package org.gamestudio.mapper;

import org.gamestudio.dto.request.CommentRequest;
import org.gamestudio.dto.response.CommentResponse;
import org.gamestudio.entity.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment fromRequest(CommentRequest commentRequest);

    CommentResponse toResponse(Comment comment);
}
