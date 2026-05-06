package org.gamestudio.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.gamestudio.dto.request.RegistrationRequest;
import org.gamestudio.dto.response.UserResponse;
import org.gamestudio.entity.UserEntity;
import org.gamestudio.mapper.UserEntityMapper;
import org.gamestudio.repository.UserEntityJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserEntityJpaRepository userEntityJpaRepository;
    private final UserEntityMapper userEntityMapper;

    @Transactional
    public UserResponse registerUser(RegistrationRequest registrationRequest) throws EntityExistsException {
        if (userEntityJpaRepository.existsByEmailOrUsername(registrationRequest.email(), registrationRequest.username())) {
            throw new EntityExistsException();
        }

        UserEntity userEntity = userEntityMapper.fromRegistrationRequest(registrationRequest);

        userEntityJpaRepository.save(userEntity);

        return userEntityMapper.toResponse(userEntity);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) throws EntityNotFoundException {
        return userEntityMapper.toResponse(userEntityJpaRepository.findByEmail(email)
                .orElseThrow(EntityNotFoundException::new));
    }
}
