package org.gamestudio.service;

import lombok.RequiredArgsConstructor;
import org.gamestudio.dto.request.RatingRequest;
import org.gamestudio.dto.response.RatingResponse;
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
class RatingServiceTest implements ServiceTest<RatingRequest, RatingResponse> {
    @Autowired
    private final RatingService ratingService;

    @Test
    public void findByIdTest() {
        List<RatingResponse> ratings = getAll();

        long id = ratings.get(0).id();

        Assertions.assertEquals(id, ratingService.findRatingById(id).id());
    }

    @Test
    public void deleteByIdTest() {
        List<RatingResponse> ratings = getAll();

        long id = ratings.get(0).id();

        int ratingsCount = ratings.size();

        ratingService.deleteRatingById(id);

        Assertions.assertEquals(ratingsCount - 1, ratingService.findAllRatings().size());
    }

    @Override
    public RatingRequest getEntity() {
        return new RatingRequest("game", "player1", 5, new Date());
    }

    @Override
    public List<RatingResponse> getAll() {
        List<RatingResponse> ratings = ratingService.findAllRatings();

        if (Objects.isNull(ratings)) {
            ratingService.saveRating(getEntity());

            ratings = ratingService.findAllRatings();
        }

        return ratings;
    }
}
