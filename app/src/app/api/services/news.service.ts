import {Injectable} from '@angular/core';
import {ApiService, AuthHttpService} from '../../api';
import {News} from '../../../typings/responses/responses';
import {Observable} from 'rxjs';
import {Response} from '@angular/http';
import {NewsStore} from './news.store';

@Injectable()
export class NewsService extends ApiService {

  constructor(http: AuthHttpService, private newsStore: NewsStore) {
    super(http);
  }

  getNews(id?: number): Observable<News[]|News> {
    if (id) {
      return this.http.get(this.apiEndpoint + '/api/news/' + id)
        .map((response: Response) => {
          let news = response.json();
          this.newsStore.updateNews(news);
          return news;
        })
        .map((news: News) => this.adjustIcon(news))
        .share();
    }

    return this.http.get(this.apiEndpoint + '/api/news')
      .map((response: Response) => {
        let news: News[] = response.json();
        this.newsStore.setNews(news);
        return news;
      })
      .map((news: News[]) => {
        news.forEach(single => this.adjustIcon(single));
        return news;
      })
      .share();
  }

  postNews(data: News): Observable<News> {
    return this.http.post(this.apiEndpoint + '/api/news', data)
      .map((response: Response) => {
        let news = response.json();
        this.newsStore.updateNews(news);
        return news;
      });
  }

  updateNews(data: News): Observable<News> {
    return this.http.patch(this.apiEndpoint + '/api/news/' + data.id, data)
      .map((response: Response) => {
        let news = response.json();
        this.newsStore.updateNews(news);
        return news;
      });
  }

  deleteNews(id: number): Observable<boolean> {
      return this.http.delete(this.apiEndpoint + '/api/news/' + id)
          .map((response: Response) => {
              if (response.status === 200) {
                  this.newsStore.deleteNews(id);
                  return true;
              }
              return false;
          });
  }

  private adjustIcon(news: News) {
    const isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
    if (news.icon && !isAbsoluteUrl.test(news.icon) && !news.icon.startsWith('data:image')) {
      news.icon = process.env.data.apiEndpoint + news.icon;
    }
    return news;
  }

}
