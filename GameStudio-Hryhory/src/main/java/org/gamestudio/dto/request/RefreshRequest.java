package org.gamestudio.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record RefreshRequest(@NotEmpty String refreshToken) {
}
