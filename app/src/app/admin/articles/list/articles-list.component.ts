import {Component, OnInit, OnDestroy} from '@angular/core'
import {Article} from "../../../../typings/responses/responses";
import {Subscription} from "rxjs";
import {Modal} from "../../../shared/modal-util/modal-util";
import {ArticlesService} from "../../../api/services/articles.service";

@Component({
  selector: 'articles-list',
  templateUrl: 'articles-list.component.html'
})
export class ArticlesListComponent implements OnInit, OnDestroy {

  articles: Article[] = [];

  private allArticlesSubscription: Subscription;

  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.allArticlesSubscription = this.articlesService.getArticles().subscribe(articles => this.articles = articles);
  }

  ngOnDestroy(): void {
    this.allArticlesSubscription.unsubscribe();
  }

  onDelete(id: number, fieldset?: HTMLElement) {
    let article = this.articles.find((article: Article) => article.id == id);

    Modal.getDangerDialog()
      .content(`Czy na pewno chcesz usunąć news "${article.title}"?`)
      .header('Usuwanie')
      .confirm('Usuń')
      .onResolve(() => {
        if (fieldset) {
          jQuery(fieldset).attr('disabled', 'disabled');
        }
        this.articlesService.deleteArticle(id).subscribe(
          (isDeleted: boolean) => {
            this.allArticlesSubscription.unsubscribe();
            this.allArticlesSubscription = this.articlesService.getArticles().subscribe(articles => this.articles = articles);
          },
          (error: any) => {
            jQuery(fieldset).removeAttr('disabled');
          }
        );
      })
      .show();
  }
}