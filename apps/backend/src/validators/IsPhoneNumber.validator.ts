import { registerDecorator, ValidationArguments } from 'class-validator'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ISO } from 'src/types'

interface ValidationOptions {
  message?: string | ((validationArguments: ValidationArguments) => string)
}

const availableISO: ISO[] = ['en-US', 'ru-RU']

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: Object.assign(
        {
          message(validationArguments: ValidationArguments) {
            return `${validationArguments.property} must be a valid phone number`
          },
        },
        validationOptions,
      ),
      validator: (phone: any): boolean => {
        if (typeof phone !== 'string') {
          return false
        }

        const parsed = parsePhoneNumberFromString(phone)
        if (!parsed || !parsed.country) {
          return false
        }

        if (
          !availableISO.map(iso => iso.split('-')[1]).includes(parsed.country)
        ) {
          return false
        }

        return true
      },
    })
  }
}
