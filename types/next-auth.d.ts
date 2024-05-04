import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import { user } from '@/types';

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//   }
// }

declare module 'next-auth' {
  interface Session {
    user: user
  }
}
