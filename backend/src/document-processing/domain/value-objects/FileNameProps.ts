import { Either } from "../../../shared/domain/Either";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface FileNameProps {
    value: string;
}

export class FileName extends ValueObject<FileNameProps> {
    private constructor(props: FileNameProps) { super(props); }

    get value(): string {
        return this.props.value;
    }

    static create(fileName: string): Either<Error, FileName> {
        if (!fileName || fileName.trim().length === 0) {
            return Either.left(new Error('File name cannot be empty'));
        }
        if(!fileName.toLowerCase().endsWith('.csv')) {
            return Either.left(new Error('El Archivo debe tener la extensión .csv'));
        }
        return Either.right(new FileName({ value: fileName }));
    }
}