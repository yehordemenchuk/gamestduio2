package org.gamestudio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestConfig {
    @Bean
    RestClient restClient() {
        return RestClient.builder()
                .requestInterceptor((request, body, execution) -> {
                    System.out.println("--- REQUEST ---");
                    System.out.println("URL: " + request.getURI());
                    System.out.println("HEADERS: " + request.getHeaders());
                    System.out.println("BODY: " + new String(body));
                    return execution.execute(request, body);
                })
                .build();
    }
}
