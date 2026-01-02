
export interface PostgresQueryResult<T> {
    rows: T[];
    rowCount: number;
    command: string;
    oid: number;
    fields: Array<{
        name: string;
        tableID: number;
        columnID: number;
        dataTypeID: number;
        dataTypeSize: number;
        dataTypeModifier: number;
        format: string;
    }>;
}
