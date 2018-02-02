import { Recipe } from '../models/recipe';
import { Ingredient } from '../models/ingredient';
import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Http, Response } from '@angular/http';

import 'rxjs/Rx';

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  constructor(private authService: AuthService,
              private http: Http) {}

  addRecipe(title: string,
            description: string,
            difficulty: string,
            ingredients: Ingredient[]) {

    this.recipes.push(new Recipe(title, description, difficulty, ingredients));
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  updateRecipe(index: number,
               title: string,
               description: string,
               difficulty: string,
               ingredients: Ingredient[]) {

    this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http
      .put('https://ionic-recipe-book-9f62a.firebaseio.com/' + userId + '/recipes.json?auth=' + token, this.recipes)
      .map((response: Response) => response.json());
  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://ionic-recipe-book-9f62a.firebaseio.com/' + userId + '/recipes.json?auth=' + token)
      .map((response: Response) => {
        const recipes: Recipe[] = response.json() ? response.json() : [];
        for (let item of recipes) {
          if (!item.hasOwnProperty('ingredients')) {
            item.ingredients = [];
          }
        }

        return recipes;
      })
      .do((data: Recipe[]) => {
        if (data) {
          this.recipes = data;
        } else {
          this.recipes = [];
        }
      });
  }
}
