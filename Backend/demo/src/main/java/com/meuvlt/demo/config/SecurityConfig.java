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
                        // ✅ PÚBLICOS - SEM AUTENTICAÇÃO
                        // ============================================================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/**").permitAll()

                        // ============================================================
                        // ⭐ USUÁRIOS - Edição e perfil
                        // ============================================================
                        // Qualquer autenticado pode editar seu perfil
                        .requestMatchers(HttpMethod.PUT, "/usuarios/**").authenticated()
                        // Apenas Admin pode deletar usuários
                        .requestMatchers(HttpMethod.DELETE, "/usuarios/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ ALERTA - Admin apenas
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/alertas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/alertas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/alertas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ AVALIACAO - REMOVIDA (sem permissões)
                        // ============================================================
                        // Nenhuma operação POST/PUT/DELETE permitida
                        // Se tentar: 403 Forbidden
                        .requestMatchers(HttpMethod.POST, "/avaliacao/**")
                        .denyAll()
                        .requestMatchers(HttpMethod.PUT, "/avaliacao/**")
                        .denyAll()
                        .requestMatchers(HttpMethod.DELETE, "/avaliacao/**")
                        .denyAll()

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
                        // ⭐ INCIDENTE - Apenas Condutor cria, Admin aprova/rejeita/deleta
                        // ============================================================
                        // ✅ APENAS CONDUTOR pode criar incidente
                        .requestMatchers(HttpMethod.POST, "/incidente/**")
                        .hasAnyAuthority("ROLE_Condutor", "Condutor")
                        // Apenas Admin pode editar incidentes
                        .requestMatchers(HttpMethod.PUT, "/incidente/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        // Apenas Admin pode deletar incidentes
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

                        // Rota alternativa para /api/linhas (se houver)
                        .requestMatchers(HttpMethod.POST, "/api/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/api/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/api/linhas/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ⭐ VIAGEM - Apenas Admin cria, Admin edita/deleta
                        // ============================================================
                        // ✅ APENAS ADMIN pode criar viagem
                        .requestMatchers(HttpMethod.POST, "/viagem/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        // Apenas Admin pode editar viagem
                        .requestMatchers(HttpMethod.PUT, "/viagem/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        // Apenas Admin pode deletar viagem
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
                        // ⭐ FALLBACK - Qualquer outra rota POST/PUT/DELETE precisa ser Admin
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.PUT, "/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")
                        .requestMatchers(HttpMethod.DELETE, "/**")
                        .hasAnyAuthority("ROLE_Administrador", "Administrador")

                        // ============================================================
                        // ✅ FINAL - Tudo que não foi especificado requer autenticação
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
