package org.gamestudio.repository;

import org.gamestudio.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreJpaRepository extends JpaRepository<Score, Long> {
    List<Score> findTop10ByGameOrderByPointsDesc(String game);
}
