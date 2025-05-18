package com.rhythmix.auth_service.converter;

import com.rhythmix.auth_service.dto.UserAuthResponse;
import com.rhythmix.auth_service.dto.UserRegResponse;
import org.mapstruct.Mapper;

@Mapper
public interface UserConverter {

    UserRegResponse toUserRegResponse(UserAuthResponse userAuthResponse);

}
