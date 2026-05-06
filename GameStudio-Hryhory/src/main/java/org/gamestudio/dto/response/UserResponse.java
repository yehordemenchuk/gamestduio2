package org.gamestudio.dto.response;

public record UserResponse(Long id,
                           String username,
                           String email,
                           String password,
                           String userRole) {
}
