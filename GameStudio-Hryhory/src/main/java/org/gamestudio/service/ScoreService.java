package org.gamestudio.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.gamestudio.dto.request.ScoreRequest;
import org.gamestudio.dto.response.ScoreResponse;
import org.gamestudio.entity.Score;
import org.gamestudio.mapper.ScoreMapper;
import org.gamestudio.repository.ScoreJpaRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScoreService {
    private final ScoreMapper scoreMapper;
    private final ScoreJpaRepository scoreJpaRepository;

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "scores", allEntries = true),
            @CacheEvict(value = "top", allEntries = true)
    })
    public ScoreResponse createScore(ScoreRequest scoreRequest) {
        Score score = scoreJpaRepository.save(scoreMapper.fromRequest(scoreRequest));

        return scoreMapper.toResponse(score);
    }

    @Cacheable(value = "score")
    public ScoreResponse findScoreById(long id) throws EntityNotFoundException {
        Score score = findScoreEntityById(id);

        return scoreMapper.toResponse(score);
    }

    @Cacheable(value = "scores")
    public List<ScoreResponse> findAllScores() {
        return scoreJpaRepository.findAll()
                .stream()
                .map(scoreMapper::toResponse)
                .toList();
    }

    @Cacheable(value = "top")
    public List<ScoreResponse> findTopByGame(String game) {
        return scoreJpaRepository.findTop10ByGameOrderByPointsDesc(game)
                .stream()
                .map(scoreMapper::toResponse)
                .toList();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "score", key = "#id"),
            @CacheEvict(value = "scores", allEntries = true),
            @CacheEvict(value = "top", allEntries = true)
    })
    public ScoreResponse updateScore(long id, ScoreRequest scoreRequest) throws EntityNotFoundException {
        Score score = findScoreEntityById(id);

        scoreMapper.updateScoreFromRequest(scoreRequest, score);

        return scoreMapper.toResponse(score);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "score"),
            @CacheEvict(value = "scores", allEntries = true),
            @CacheEvict(value = "scores", allEntries = true)
    })
    public void deleteScoreById(long id) throws EntityNotFoundException {
        if (!scoreJpaRepository.existsById(id)) {
            throw new EntityNotFoundException();
        }

        scoreJpaRepository.deleteById(id);
    }

    private Score findScoreEntityById(long id) throws EntityNotFoundException {
        return scoreJpaRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }
}
