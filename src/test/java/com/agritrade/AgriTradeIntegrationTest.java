package com.agritrade;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class AgriTradeIntegrationTest {

    @Test
    void applicationContextLoads() {
    }
}