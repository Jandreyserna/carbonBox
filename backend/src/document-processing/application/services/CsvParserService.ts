import { ActivityData } from "@domain/entities";
import { Either, ValidationError } from "@shared/domain";
import { parse } from "csv-parse/browser/esm/sync";


export interface CsvParseResult {
    validRows: ActivityData[];
    invalidRowsCount: number;
    totalRows: number;
}

export class CsvParserService {
    public parse(fileBuffer: Buffer, uploadId: string): Either<ValidationError, CsvParseResult> {
        let rows: Record<string, string>[];

        try {
            rows = parse(fileBuffer, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
        } catch (error) {
            return Either.left(new ValidationError('Error parsiando el archivo CSV: '));
        }

        const validRows: ActivityData[] = [];
        let invalidRowsCount = 0;

        for (const row of rows) {
            const activityDataOrError = ActivityData.create({
                uploadId,
                category: row['category'] ?? '',
                amount: +row['amount'],
                unit: row['unit'] ?? '',
                date: new Date(row['date'] ?? ''),
            });

            if (activityDataOrError.isLeft()) {
                invalidRowsCount++;
                continue;
            }

            validRows.push(activityDataOrError.value);
        }

        return Either.right({
            validRows,
            invalidRowsCount,
            totalRows: rows.length,
        });
    }
}