import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

/** Skip Firebase auth for this route (health checks, webhooks, etc.). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
