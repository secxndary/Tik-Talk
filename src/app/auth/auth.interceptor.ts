import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const accessToken = authService.accessToken;
    
    if (!accessToken)
        return next(req);

    if (isRefreshing)
        return refreshAndProceed(authService, req, next);

    getRequestWithAddedToken(req, accessToken);

    return next(getRequestWithAddedToken(req, accessToken))
        .pipe(
            catchError(error => {
                if (error.status === 403) {
                    return refreshAndProceed(authService, req, next);
                }

                return throwError(error);
            })
        );
}

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
    if (isRefreshing) {
        return next(getRequestWithAddedToken(req, authService.accessToken!));
    }

    isRefreshing = true;

    return authService.refreshAuthToken()
        .pipe(
            // переключаемся на другой поток
            switchMap((res) => {
                isRefreshing = false;

                return next(getRequestWithAddedToken(req, res.access_token));
            })
        )
}

const getRequestWithAddedToken = (req: HttpRequest<any>, accessToken: string) : HttpRequest<any>=> {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`   
        }
    });
}