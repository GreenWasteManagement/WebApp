package com.webpage.webapp.dtos.bucket.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class GetBucketMunicipalitiesByUserIdAndStatusRequestDTO {
    private Long userId;
    private Boolean status;
}
