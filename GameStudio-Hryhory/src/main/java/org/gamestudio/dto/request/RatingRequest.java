package org.gamestudio.dto.request;

import jakarta.validation.constraints.*;

import java.util.Date;

public record RatingRequest(@NotEmpty String game,
                            @NotEmpty String player,
                            @Min(0) @Max(5) Integer rating,
                            @NotEmpty Date ratedOn) {
}
