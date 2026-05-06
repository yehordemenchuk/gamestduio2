package org.gamestudio.dto.response;

public record AuthResponse(String accessToken,
                           String refreshToken) {
}
