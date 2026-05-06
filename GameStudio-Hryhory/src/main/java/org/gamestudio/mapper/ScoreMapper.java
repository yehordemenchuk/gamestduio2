package org.gamestudio.mapper;

import org.gamestudio.dto.request.ScoreRequest;
import org.gamestudio.dto.response.ScoreResponse;
import org.gamestudio.entity.Score;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ScoreMapper {
    Score fromRequest(ScoreRequest request);

    ScoreResponse toResponse(Score score);

    void updateScoreFromRequest(ScoreRequest request,
                                @MappingTarget Score score);
}
