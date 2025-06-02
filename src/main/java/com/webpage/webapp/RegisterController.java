package com.webpage.webapp;

import org.springframework.web.bind.annotation.GetMapping;

public class RegisterController {
    @GetMapping("/register")
    public String register() {
        return "register";
    }
}
