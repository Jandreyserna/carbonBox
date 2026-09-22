import { Upload } from './document-processing/domain/entities/Upload';

const result = Upload.create({ fileName: 'test.csv', fileUrl: 'local://test.csv', userId: 'user-123' });
if (result.isRight()) {
  console.log('Upload creado:', result.value.id, result.value.status); // debería imprimir PENDING
}

const invalido = Upload.create({ fileName: 'test.txt', fileUrl: '', userId: 'user-123' });
console.log('Debe fallar:', invalido.isLeft()); // true, porque no termina en .csv