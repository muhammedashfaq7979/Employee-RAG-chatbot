package com.company.policyrag.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Employee Policy API")
                        .version("1.0.0")
                        .description("""
                                Employee Policy backend API.

                                Authentication supports registration, login, refresh-token rotation, logout,
                                and the current-user profile. HR users can manage employee profiles and their
                                associated leave and allowance balances. Policy chat and document APIs are also
                                available.

                                Use the access token returned by registration or login with the Authorize button.
                                """))
                .servers(List.of(
                        new Server().url("http://localhost:8000").description("Local Spring Boot server")
                ))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Access token from `/api/auth/login` or `/api/auth/register`.")));
    }
}
