package com.webpage.webapp.dtos.bucket.response;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Data
public class CreateDepositResponseDTO {
    private Instant depositTimestamp;
}
