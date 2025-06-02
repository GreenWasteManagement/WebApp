package com.webpage.webapp.dtos.user.response;

import com.webpage.webapp.dtos.user.request.CreateAdminRequestDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CreateAdminResponseDTO {
    private CreateAdminRequestDTO.Admin admin;

    @Getter
    @Setter
    @Data
    public static class Admin {
        private String citizenCardCode;
    }
}
