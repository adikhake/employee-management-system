package com.application.demo.security;

import com.application.demo.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    public SecurityConfig(JwtUtils jwtUtils,
                          UserDetailsServiceImpl userDetailsService,
                          JwtAuthenticationEntryPoint unauthorizedHandler) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
    }

    @Bean
    public AuthTokenFilter authTokenFilter() {
        return new AuthTokenFilter(jwtUtils, userDetailsService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults());

        http.csrf(csrf -> csrf.disable());

        http.exceptionHandling(e -> e.authenticationEntryPoint(unauthorizedHandler));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers("/api/auth/**", "/public/**").permitAll()
                .requestMatchers("/api/employees").hasRole("ADMIN")
                .requestMatchers("/api/employees/me").authenticated() 
                .requestMatchers("/api/employee/me").authenticated() 
                .requestMatchers("/api/employees/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        );

        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        http.httpBasic(Customizer.withDefaults());

        return http.build();
    }

   
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*")); 
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
