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
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.addAllowedOriginPattern("*");
                    corsConfig.addAllowedHeader("*");
                    corsConfig.addAllowedMethod("*");
                    corsConfig.addExposedHeader("Authorization");
                    corsConfig.setAllowCredentials(true);
                    corsConfig.setMaxAge(3600L);
                    return corsConfig;
                }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Rotas Públicas (Login e Leitura Geral)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/**").permitAll() // Libera todos os GETs (Linhas, Alertas, VLTs)

                        // 2. ÁREA DO CONDUTOR (CORREÇÃO CRÍTICA AQUI)
                        // Usa hasAnyAuthority para aceitar "ROLE_Condutor" (padrão Spring) ou "Condutor" (se vier puro)
                        .requestMatchers(HttpMethod.POST, "/incidente/**").hasAnyAuthority("ROLE_Condutor", "Condutor", "ROLE_Administrador", "Administrador")
                        .requestMatchers("/condutor/**").permitAll()

                        // 3. ÁREA DO ADMINISTRADOR (Operações de Escrita/Deleção)
                        .requestMatchers(HttpMethod.PUT, "/incidente/**").hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/incidente/**").hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // Demais rotas administrativas
                        .requestMatchers(HttpMethod.POST, "/**").hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/**").hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/**").hasAnyAuthority("ROLE_Administrador", "Administrador")

                        .anyRequest().authenticated()
                )
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