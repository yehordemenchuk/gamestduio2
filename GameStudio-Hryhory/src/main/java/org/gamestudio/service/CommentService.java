package org.gamestudio.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.gamestudio.dto.request.CommentRequest;
import org.gamestudio.dto.response.CommentResponse;
import org.gamestudio.entity.Comment;
import org.gamestudio.mapper.CommentMapper;
import org.gamestudio.repository.CommentJpaRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentMapper commentMapper;
    private final CommentJpaRepository commentJpaRepository;

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "comments", allEntries = true),
            @CacheEvict(value = "commentsByGame", allEntries = true)
    })
    public CommentResponse createComment(CommentRequest commentRequest) {
        Comment comment = commentJpaRepository.save(commentMapper.fromRequest(commentRequest));

        return commentMapper.toResponse(comment);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "comment")
    public CommentResponse findCommentById(long id) throws EntityNotFoundException {
        Comment comment = commentJpaRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        return commentMapper.toResponse(comment);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "comments")
    public List<CommentResponse> findAllComments() {
        return commentJpaRepository.findAll()
                .stream()
                .map(commentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "commentsByGame")
    public List<CommentResponse> findCommentsByGame(String game) {
        return commentJpaRepository.findCommentsByGame(game)
                .stream()
                .map(commentMapper::toResponse)
                .toList();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "comment"),
            @CacheEvict(value = "comments", allEntries = true),
            @CacheEvict(value = "commentsByGame", allEntries = true)
    })
    public void deleteCommentById(long id) throws EntityNotFoundException {
        if (!commentJpaRepository.existsById(id)) {
            throw new EntityNotFoundException();
        }

        commentJpaRepository.deleteById(id);
    }
}
