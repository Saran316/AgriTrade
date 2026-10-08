package com.agritrade.service;

import com.agritrade.dto.AuthResponse;
import com.agritrade.dto.LoginRequest;
import com.agritrade.dto.RegisterRequest;
import com.agritrade.entity.User;
import com.agritrade.repository.UserRepository;
import com.agritrade.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        authService = new AuthService(
                repository,
                passwordEncoder,
                authenticationManager,
                jwtService
        );
    }

    // ---------------------------------------------------------
    // TEST 1: Successful Registration
    // ---------------------------------------------------------

    @Test
    void register_shouldCreateUserSuccessfully() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Saran");
        request.setEmail(" SARAN@EXAMPLE.COM ");
        request.setPassword("Saran@123");

        when(repository.existsByEmail("saran@example.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("Saran@123"))
                .thenReturn("encoded-password");

        User savedUser = new User();
        savedUser.setName("Saran");
        savedUser.setEmail("saran@example.com");
        savedUser.setPassword("encoded-password");
        savedUser.setRole("USER");

        when(repository.save(any(User.class)))
                .thenReturn(savedUser);

        when(jwtService.generateToken(savedUser))
                .thenReturn("test-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("test-jwt-token", response.getToken());

        verify(repository)
                .existsByEmail("saran@example.com");

        verify(passwordEncoder)
                .encode("Saran@123");

        verify(repository)
                .save(any(User.class));

        verify(jwtService)
                .generateToken(savedUser);
    }

    // ---------------------------------------------------------
    // TEST 2: Duplicate Email Registration
    // ---------------------------------------------------------

    @Test
    void register_shouldRejectDuplicateEmail() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Saran");
        request.setEmail(" SARAN@EXAMPLE.COM ");
        request.setPassword("Saran@123");

        when(repository.existsByEmail("saran@example.com"))
                .thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(request)
        );

        assertEquals(
                409,
                exception.getStatusCode().value()
        );

        verify(repository)
                .existsByEmail("saran@example.com");

        verify(repository, never())
                .save(any(User.class));

        verify(jwtService, never())
                .generateToken(any(User.class));
    }

    // ---------------------------------------------------------
    // TEST 3: Successful Login
    // ---------------------------------------------------------

    @Test
    void login_shouldAuthenticateSuccessfully() {

        LoginRequest request = new LoginRequest();
        request.setEmail(" SARAN@EXAMPLE.COM ");
        request.setPassword("Saran@123");

        User user = new User();
        user.setName("Saran");
        user.setEmail("saran@example.com");
        user.setPassword("encoded-password");
        user.setRole("USER");

        when(repository.findByEmail("saran@example.com"))
                .thenReturn(Optional.of(user));

        when(jwtService.generateToken(user))
                .thenReturn("login-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);

        assertEquals(
                "login-jwt-token",
                response.getToken()
        );

        verify(authenticationManager)
                .authenticate(any());

        verify(repository)
                .findByEmail("saran@example.com");

        verify(jwtService)
                .generateToken(user);
    }

    // ---------------------------------------------------------
    // TEST 4: Login - User Does Not Exist
    // ---------------------------------------------------------

    @Test
    void login_shouldRejectWhenUserDoesNotExist() {

        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@example.com");
        request.setPassword("Password@123");

        when(authenticationManager.authenticate(
                any(UsernamePasswordAuthenticationToken.class)
        )).thenReturn(null);

        when(repository.findByEmail("unknown@example.com"))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(
                401,
                exception.getStatusCode().value()
        );

        verify(authenticationManager)
                .authenticate(
                        any(UsernamePasswordAuthenticationToken.class)
                );

        verify(repository)
                .findByEmail("unknown@example.com");

        verify(jwtService, never())
                .generateToken(any(User.class));
    }
}