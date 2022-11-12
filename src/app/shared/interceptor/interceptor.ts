import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

    constructor(private loasderService: LoaderService) { }

    coutner: number = 0;
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.coutner++;
        this.loasderService.isLoading.next(true);

        return next.handle(httpRequest).pipe(
            finalize(() => {
                this.coutner--;
                if (this.coutner < 1) {
                    this.loasderService.isLoading.next(false);
                }
            })
        );
    }
}