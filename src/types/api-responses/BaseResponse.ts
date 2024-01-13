
export interface BaseResponse<TData> {
	success: boolean;
	message?: TData;
}