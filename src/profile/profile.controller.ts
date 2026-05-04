import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { CurrentFirebaseUser } from '../auth';
import { UpdateProfileImageDto } from './dto/update-profile-image.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMyProfile(@CurrentFirebaseUser() firebaseUser: DecodedIdToken) {
    return this.profileService.getProfileForFirebaseUser(firebaseUser);
  }

  @Patch('me/image')
  patchMyImage(
    @CurrentFirebaseUser() firebaseUser: DecodedIdToken,
    @Body() dto: UpdateProfileImageDto,
  ) {
    return this.profileService.updateProfileImage(firebaseUser, dto);
  }
}
