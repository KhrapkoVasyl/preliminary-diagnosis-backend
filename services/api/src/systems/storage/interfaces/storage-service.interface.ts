import { FileEntity } from 'src/modules/files/file.entity';
import { IMultipartFile } from './multipart-file.interface';

export interface StorageService {
  createOne(
    file: IMultipartFile,
    pathToFile: string,
    options: unknown,
  ): Promise<Partial<FileEntity>>;

  deleteOne(filePath: string): Promise<void>;
}
