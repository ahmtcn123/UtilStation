import { TypedResponse } from "@remix-run/cloudflare";


export type CommonActionReturnType<T> = {
    isError: boolean;
    message: string;
    data?: T | null;
};

export type CommonActionReturn<T> = Promise<TypedResponse<CommonActionReturnType<T>>>;