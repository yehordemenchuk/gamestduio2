package org.gamestudio.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "gamestudio-api",
                version = "v1",
                description = "Responsible for gamestudio project backend implementation."
        )
)
public class SwaggerConfig {
}
