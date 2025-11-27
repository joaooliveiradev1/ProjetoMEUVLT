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

                        // ============================================================
                        // 1️⃣ PREFLIGHT - OPTIONS sempre permitido
                        // ============================================================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ============================================================
                        // 2️⃣ AUTH - Login/Register sem autenticação
                        // ============================================================
                        .requestMatchers("/auth/**").permitAll()

                        // ============================================================
                        // 3️⃣ GET PÚBLICOS - Dados legíveis por todos
                        // ============================================================
                        .requestMatchers(HttpMethod.GET, "/linhas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/estacoes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/linhas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/avaliacao/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/alertas/**").permitAll()

                        // ============================================================
                        // 4️⃣ GET USUÁRIOS - Apenas autenticados
                        // ============================================================
                        .requestMatchers(HttpMethod.GET, "/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/usuario/**").authenticated()

                        // ============================================================
                        // 5️⃣ GET CONDUTOR - Apenas autenticados
                        // ============================================================
                        .requestMatchers(HttpMethod.GET, "/condutor/**").authenticated()

                        // ============================================================
                        // 6️⃣ GET VIAGEM - Apenas autenticados
                        // ============================================================
                        .requestMatchers(HttpMethod.GET, "/viagem/**").authenticated()

                        // ============================================================
                        // 7️⃣ GET VLT - Apenas autenticados
                        // ============================================================
                        .requestMatchers(HttpMethod.GET, "/vlt/**").authenticated()

                        // ============================================================
                        // ⭐ USUÁRIOS - PUT (editar perfil próprio)
                        // ============================================================
                        .requestMatchers(HttpMethod.PUT, "/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/usuarios/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ ALERTAS - Admin apenas
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/alertas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/alertas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/alertas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ AVALIACAO - COMPLETAMENTE BLOQUEADA
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/avaliacao/**").denyAll()
                        .requestMatchers(HttpMethod.PUT, "/avaliacao/**").denyAll()
                        .requestMatchers(HttpMethod.DELETE, "/avaliacao/**").denyAll()

                        // ============================================================
                        // ⭐ CONDUTOR - Admin apenas
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/condutor/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/condutor/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/condutor/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ ESTACAO - Admin apenas
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/estacoes/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/estacoes/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/estacoes/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ INCIDENTE - Condutor cria, Admin aprova/rejeita/deleta
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/incidente/**")
                        .hasAnyAuthority("ROLE_Condutor", "Condutor", "ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/incidente/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/incidente/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ LINHA - Admin apenas
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        .requestMatchers(HttpMethod.POST, "/api/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/api/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/api/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ VIAGEM - Admin apenas
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/viagem/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/viagem/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/viagem/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ VLT - Admin apenas
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/vlt/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/vlt/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/vlt/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ✅ FINAL - Qualquer outra rota requer autenticação
                        // ============================================================
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
