import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from "rxjs";

// BehaviorSubject – это гибрид между stream и signal
// Можно как подписаться на него, так и в любой момент без подписки получить его значение
let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const accessToken = authService.accessToken;

    if (!accessToken)
        return next(req);

    if (isRefreshing$.value)
        return refreshAndProceed(authService, req, next);

    return next(getRequestWithAddedToken(req, accessToken))
        .pipe(
            catchError(error => {
                if (error.status === 403) {
                    return refreshAndProceed(authService, req, next);
                }

                return throwError(() => error);
            })
        );
}

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!isRefreshing$.value) {
        isRefreshing$.next(true);

        return authService.refreshAuthToken()
            .pipe(
                // переключаемся на другой поток
                switchMap(res => {
                    return next(getRequestWithAddedToken(req, res.access_token))
                        .pipe(
                            tap(() => isRefreshing$.next(false))
                        );
                })
            );
    }

    // сам запрос на /refresh пропускаем через next()
    if (req.url.includes('refresh'))
        return next(getRequestWithAddedToken(req, authService.accessToken!));

    return isRefreshing$.pipe(
        // подписываемся на isRefreshing$ и ждём, пока он станет false (через filter),
        // т.е. refresh закончится, и только после этого отправляем повторный запрос
        filter(isRefreshing => !isRefreshing),
        switchMap(res => {
            return next(getRequestWithAddedToken(req, authService.accessToken!));
        })
    );

}

const getRequestWithAddedToken = (req: HttpRequest<any>, accessToken: string) : HttpRequest<any>=> {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`   
        }
    });
}