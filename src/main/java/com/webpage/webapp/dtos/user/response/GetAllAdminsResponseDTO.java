package com.webpage.webapp.dtos.user.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
public class GetAllAdminsResponseDTO {
    private List<AdminData> admins;

    @Getter
    @Setter
    @Data
    public static class AdminData {
        private User user;
        private Admin admin;
        private Address address;
        private PostalCode postalCode;
    }

    @Getter
    @Setter
    @Data
    public static class User {
        private Long id;
        private String name;
        private String username;
        //private String password;
        private String email;
        private String phoneNumber;
        private String role;
    }

    @Getter
    @Setter
    @Data
    public static class Admin {
        private String citizenCardCode;
    }

    @Getter
    @Setter
    @Data
    public static class Address {
        private String floorDetails;
        private Integer floorNumber;
        private Integer doorNumber;
        private String street;
    }

    @Getter
    @Setter
    @Data
    public static class PostalCode {
        private String postalCode;
        private String county;
        private String district;
    }
}
