package org.gamestudio.mapper;

import org.gamestudio.dto.request.RatingRequest;
import org.gamestudio.dto.response.RatingResponse;
import org.gamestudio.entity.Rating;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RatingMapper {
    Rating fromRequest(RatingRequest ratingRequest);

    RatingResponse toResponse(Rating rating);
}
