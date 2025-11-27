package com.meuvlt.demo.config;

import com.meuvlt.demo.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();

                    config.setAllowedOrigins(List.of("http://localhost:3000"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setExposedHeaders(List.of("Authorization"));
                    config.setAllowCredentials(true);

                    return config;
                }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ⭐ Rotas públicas
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/**").permitAll()

                        // ⭐ Condutor pode criar incidentes
                        .requestMatchers(HttpMethod.POST, "/incidente/**")
                        .hasAnyAuthority("ROLE_Condutor", "Condutor",
                                "ROLE_Administrador", "Administrador")

                        // ⭐ Condutor: GET liberado acima, POST só incidente
                        .requestMatchers("/condutor/**").permitAll()

                        // ⭐ Admin edita / exclui incidentes
                        .requestMatchers(HttpMethod.PUT, "/incidente/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/incidente/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ⭐ Operações administrativas gerais
                        .requestMatchers(HttpMethod.POST, "/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ⭐ Qualquer outra rota requer autenticação
                        .anyRequest().authenticated()
                )

                // Filtro JWT antes da autenticação padrão
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}