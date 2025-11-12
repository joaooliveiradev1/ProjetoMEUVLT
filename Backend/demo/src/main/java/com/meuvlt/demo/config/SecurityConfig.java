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
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/login",
                                "/auth/register",
                                "/auth/recuperar-senha",
                                "/auth/validate-token"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/linhas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/linhas/**").hasAuthority("Administrador")
                        .requestMatchers(HttpMethod.PUT, "/api/linhas/**").hasAuthority("Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/api/linhas/**").hasAuthority("Administrador")

                        .requestMatchers(HttpMethod.GET, "/estacoes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/estacoes/**").hasAuthority("Administrador")
                        .requestMatchers(HttpMethod.PUT, "/estacoes/**").hasAuthority("Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/estacoes/**").hasAuthority("Administrador")

                        .requestMatchers("/vlt/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/vlt/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/vlt/**").hasAuthority("Administrador")
                        .requestMatchers(HttpMethod.PUT, "/vlt/**").hasAuthority("Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/vlt/**").hasAuthority("Administrador")

                        .requestMatchers("/usuarios/**").hasAuthority("Administrador")

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
