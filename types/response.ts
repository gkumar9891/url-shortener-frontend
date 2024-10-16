export type ApiResponse = {
    message: unknown,
    status: 'error' | 'success' | 'fail',
    data: any
}