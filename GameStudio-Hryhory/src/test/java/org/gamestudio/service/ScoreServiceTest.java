package org.gamestudio.service;

import lombok.RequiredArgsConstructor;
import org.gamestudio.dto.request.ScoreRequest;
import org.gamestudio.dto.response.ScoreResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestConstructor;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@SpringBootTest
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
@RequiredArgsConstructor
public class ScoreServiceTest implements ServiceTest<ScoreRequest, ScoreResponse> {
    private final ScoreService scoreService;

    @Test
    @Override
    public void findByIdTest() {
        List<ScoreResponse> scores = getAll();

        long id = scores.get(0).id();

        Assertions.assertEquals(id, scoreService.findScoreById(id).id());
    }

    @Test
    @Override
    public void deleteByIdTest() {
        List<ScoreResponse> scores = getAll();

        long id = scores.get(0).id();

        int scoresCount = scores.size();

        scoreService.deleteScoreById(id);

        Assertions.assertEquals(scoresCount - 1, scoreService.findAllScores().size());
    }

    @Override
    public ScoreRequest getEntity() {
        return new ScoreRequest("game", "player", 10, new Date());
    }

    @Override
    public List<ScoreResponse> getAll() {
        List<ScoreResponse> scores = scoreService.findAllScores();

        if (Objects.isNull(scores)) {
            scoreService.createScore(getEntity());

            scores = scoreService.findAllScores();
        }

        return scores;
    }
}
