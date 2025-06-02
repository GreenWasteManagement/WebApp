package com.webpage.webapp.dtos.user.request;

import com.webpage.webapp.dtos.base.PostalCodeDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class DeletePostalCodeRequestDTO {
    private PostalCodeDTO postalCode;
}
