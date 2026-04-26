export type Column<T> = {
    field: string;
    headerName: string;
    sortable?: boolean;
    width?: string;
    render?: (row: T) => React.ReactNode;
};

export type DataGridProps<T> = {
    columns: Column<T>[];
    rows: T[];
    loading?: boolean;
    pageSizeOptions?: number[];
    initialPageSize?: number;
    getRowId?: (row: T) => string;
};