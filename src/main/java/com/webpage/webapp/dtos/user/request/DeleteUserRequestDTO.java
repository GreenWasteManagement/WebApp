package com.webpage.webapp.dtos.user.request;

import com.webpage.webapp.dtos.base.UserDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class DeleteUserRequestDTO {
    private UserDTO user;
}
