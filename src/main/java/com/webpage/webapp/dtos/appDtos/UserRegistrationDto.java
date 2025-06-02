package com.webpage.webapp.dtos.appDtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.AssertTrue;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserRegistrationDto {

    @NotBlank(message = "O nome completo é obrigatório")
    @Size(min = 2, max = 100, message = "O nome completo deve ter entre 2 e 100 caracteres")
    private String fullName;

    @NotBlank(message = "O nome de utilizador é obrigatório")
    @Size(min = 3, max = 20, message = "O nome de utilizador deve ter entre 3 e 20 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "O nome de utilizador só pode conter letras, números, pontos, hífens e sublinhados")
    private String username;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de email inválido")
    private String email;

    @Pattern(regexp = "^9\\d{8}$", message = "Número de telemóvel inválido (deve começar por 9 e ter 9 dígitos)")
    private String phoneNumber;

    @Pattern(regexp = "^\\d{9}$", message = "Número de cartão de cidadão inválido (deve ter 9 dígitos)")
    private String citizenCardNumber;

    @Pattern(regexp = "^\\d{9}$", message = "NIF inválido (deve ter 9 dígitos)")
    private String nif;

    @NotBlank(message = "A rua é obrigatória")
    @Size(max = 100, message = "A rua não pode exceder 100 caracteres")
    private String street;

    private String doorNumber;

    private String floor;

    @NotBlank(message = "O código postal é obrigatório")
    @Pattern(regexp = "^\\d{4}-\\d{3}$", message = "Formato de código postal inválido (XXXX-XXX)")
    private String postalCode;

    @NotBlank(message = "A palavra-passe é obrigatória")
    @Size(min = 8, message = "A palavra-passe deve ter pelo menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "A palavra-passe deve conter pelo menos uma letra minúscula, uma maiúscula e um número")
    private String password;

    @NotBlank(message = "A confirmação da palavra-passe é obrigatória")
    private String confirmPassword;

    // Custom validation for password match
    @AssertTrue(message = "As palavras-passe não coincidem")
    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }
}
