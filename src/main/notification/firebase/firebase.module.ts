import { Global, Module } from '@nestjs/common';
import { FirebaseAdminProvider } from './admin.provider';


@Global() // so you don’t need to import everywhere
@Module({
  providers: [FirebaseAdminProvider],
  exports: [FirebaseAdminProvider],
})
export class FirebaseModule {}