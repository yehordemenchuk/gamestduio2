package org.gamestudio.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.gamestudio.entity.UserEntity;
import org.gamestudio.repository.UserEntityJpaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserEntityJpaRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws EntityNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(EntityNotFoundException::new);

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getUserRole().name())
                .build();
    }
}
