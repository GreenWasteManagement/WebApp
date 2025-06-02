package com.webpage.webapp.dtos.bucket.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class GetFirstBucketMunicipalityByUserAndStatusTrueRequestDTO {
    private Municipality municipality;

    @Getter
    @Setter
    @Data
    public static class Municipality {
        private Long id;
        private Long userId;
        private String citizenCardCode;
        private String nif;

    }
}
