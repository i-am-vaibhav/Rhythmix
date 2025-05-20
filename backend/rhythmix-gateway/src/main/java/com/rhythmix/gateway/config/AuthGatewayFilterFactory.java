package com.rhythmix.gateway.config;

import com.rhythmix.gateway.dto.ValidateTokenRequest;
import com.rhythmix.gateway.dto.ValidateTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthGatewayFilterFactory
        extends AbstractGatewayFilterFactory<AbstractGatewayFilterFactory.NameConfig> {

    private final WebClient webClient;

    public AuthGatewayFilterFactory(WebClient.Builder webClientBuilder,
                                    @Value("${auth.service.base-url:http://localhost:8100/auth}") String authServiceBaseUrl) {
        super(NameConfig.class);
        this.webClient = webClientBuilder.baseUrl(authServiceBaseUrl).build();
    }

    @Override
    public GatewayFilter apply(NameConfig config) {
        return new GatewayFilter() {
            @Override
            public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
                // 1. Extract the Authorization header
                String authHeader = exchange.getRequest()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

                if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
                    // no token → 401
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String userNameHeader = exchange.getRequest()
                        .getHeaders()
                        .getFirst("AuthUsername");

                if (!StringUtils.hasText(authHeader)) {
                    // no token → 401
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                // 2. Build your ValidateTokenRequest DTO
                String token = authHeader.substring(7);

                ValidateTokenRequest validateRequest = ValidateTokenRequest
                        .builder().token(token).userName(userNameHeader).build();

                // 3. Call downstream auth service
                return webClient.post()
                        .uri("/validate")
                        .bodyValue(validateRequest)
                        .retrieve()
                        .onStatus(status -> status != HttpStatus.OK,
                                resp -> Mono.error(new RuntimeException("Auth service rejected token")))
                        .bodyToMono(ValidateTokenResponse.class)
                        .flatMap(validateResponse -> {
                            if (validateResponse.isAuthenticated()) {
                                return chain.filter(exchange);
                            } else {
                                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                                return exchange.getResponse().setComplete();
                            }
                        })
                        .onErrorResume(err -> {
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }
        };
    }
}
