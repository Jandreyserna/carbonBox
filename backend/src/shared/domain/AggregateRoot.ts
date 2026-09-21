export abstract class AggregateRoot<T> {
    protected readonly _id: string;
    protected props: T;

    protected constructor(props: T, id?: string) {
        this._id = id ?? crypto.randomUUID();
        this.props = props;
    }

    get id(): string {
        return this._id;
    }

    equals(entity?: AggregateRoot<T>): boolean {
        if (entity === null || entity === undefined) {
            return false;
        }
        if (this === entity) {
            return true;
        }
        return this._id === entity._id;
    }
}