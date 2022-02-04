import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/decorators/roles-auth.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }

    const unauthorizedError = new UnauthorizedException({
      message: 'User is not authorized',
    })

    const req = context.switchToHttp().getRequest()

    const accessToken = req.cookies['access-token']

    if (accessToken) {
      try {
        const user = this.jwtService.verify(accessToken)
        req.user = user

        return requiredRoles.includes(user.role)
      } catch (error) {
        throw new HttpException('No access', HttpStatus.FORBIDDEN)
      }
    }

    const authHeader = req.headers?.authorization as string | undefined

    if (!authHeader) {
      throw unauthorizedError
    }

    const [bearer, token] = authHeader.split(' ')

    if (bearer !== 'Bearer' || !token) {
      throw unauthorizedError
    }

    try {
      const user = this.jwtService.verify(token)
      req.user = user

      return requiredRoles.includes(user.role)
    } catch (error) {
      throw new HttpException('No access', HttpStatus.FORBIDDEN)
    }
  }
}
