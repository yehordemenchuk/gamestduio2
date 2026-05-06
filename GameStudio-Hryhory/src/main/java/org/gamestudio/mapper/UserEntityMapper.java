package org.gamestudio.mapper;

import org.gamestudio.dto.request.RegistrationRequest;
import org.gamestudio.dto.response.UserResponse;
import org.gamestudio.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {
    UserEntity fromRegistrationRequest(RegistrationRequest registrationRequest);

    UserResponse toResponse(UserEntity userEntity);
}
