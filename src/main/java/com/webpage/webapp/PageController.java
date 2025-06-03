package com.webpage.webapp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/campaign")
    public String campaign() {
        return "campaign";
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }
}
