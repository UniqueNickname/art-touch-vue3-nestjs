import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop()
      const fileName = `${uuid.v4()}.${fileExtension}`
      const filePath = path.resolve(__dirname, '../../static')

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true })
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer)
      return fileName
    } catch (e) {
      throw new HttpException(
        'An error occurred while writing the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
