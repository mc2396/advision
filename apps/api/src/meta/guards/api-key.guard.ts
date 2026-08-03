import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Protezione minima per gli endpoint che parlano con Meta: richiede
 * un header `x-api-key` che corrisponda a META_SYNC_API_KEY nel .env.
 *
 * Non è un sistema di autenticazione utenti vero e proprio (niente
 * login, sessioni, utenti multipli) — è pensato per evitare che
 * chiunque conosca l'URL possa far partire una sincronizzazione,
 * nel caso questo backend finisca esposto oltre a localhost.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expectedKey = process.env.META_SYNC_API_KEY;
    if (!expectedKey) {
      // Fail-safe: se la chiave non è configurata, neghiamo per
      // default invece di lasciare l'endpoint aperto per errore.
      throw new InternalServerErrorException(
        'META_SYNC_API_KEY non configurato nel .env del backend',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.header('x-api-key');

    if (providedKey !== expectedKey) {
      throw new UnauthorizedException('Chiave API mancante o non valida');
    }

    return true;
  }
}
