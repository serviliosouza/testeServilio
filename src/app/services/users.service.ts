import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CreateUserRequest, ResultadoResponse, User, UserProjeto, NiveisUsuarios, Permissao, Projeto, Roles, UserRole} from '@app/models';
import {Observable, BehaviorSubject} from 'rxjs';

import {AuthService} from '@app/services/auth.service';
import {CatalogsService} from '@app/services/catalogs.service';
import {SistemaService} from '@app/services/sistema.service';
import {CURRENT_USER} from '@app/providers/user.provider';

@Injectable()
export class UsersService {

  protected currentUserUpdatedSource = new BehaviorSubject<User>(null);
  protected usersAccesses = new Map<string, Array<UserProjeto>>();

  currentUserUpdated: Observable<any> = this.currentUserUpdatedSource.asObservable();


  niveisUsuarios = NiveisUsuarios;

  constructor(protected http: HttpClient, protected auth: AuthService, protected catalogo: CatalogsService, protected sistema: SistemaService,
              @Inject(CURRENT_USER) protected _currentUser: User) {
    console.log('UsersService Ok');
  }

  get currentUser() {
    return this.auth.user;
  }

  set currentUser(value) {
    if (value && value !== this._currentUser) {
      this.currentUserUpdatedSource.next(value);
    }
    this.auth.user = value;
  }

  async setCurrentUser() {
    try {
      this.currentUser = await this.me().toPromise();
    } catch (e) {
      console.error(e);
    }
  }

  me() {
    return this.http.get<User>(`Users/me`);
  }

  async editMe(user: User) {
    const response = await this.http.put<ResultadoResponse>(`Users/me`, user).toPromise();
    if (response.sucesso) {
      this.currentUser = Object.assign(this.currentUser, user);
    }
    return response;
  }

  all() {
    return this.http.get<Array<User>>(`Users`);
  }

  byId(id: string) {
    return this.http.get<User>(`Users/${id}`);
  }

  create(user: CreateUserRequest) {
    return this.http.post<ResultadoResponse>(`Users`, user);
  }

  edit(user: User) {
    return this.http.put<ResultadoResponse>(`Users`, user);
  }

  remove(user: User | string) {
    const id = (typeof user === 'string') ? user : user.id;
    return this.http.delete<ResultadoResponse>(`Users/${id}`);
  }

  userProjetos(id: string) {
    return this.http.get<Array<UserProjeto>>(`UserProjetos/${id}`);
  }

  criarUserProjeto(userProjetos: Array<UserProjeto>) {
    return this.http.post<ResultadoResponse>(`UserProjetos`, userProjetos);
  }

  userAvatar(id: string) {
    return this.http.get<any>(`Users/${id}/avatar`);
  }

  async userCanAccess(id: string, projeto: Projeto, permissao: any = null) {

    const permissoes = await this.catalogo.permissoes().toPromise();
    const projetos = this.usersAccesses.has(id) ? this.usersAccesses.get(id) : await this.userProjetos(id).toPromise();

    if (projetos.length === 0 || permissoes.length === 0) {
      return false;
    }

    this.usersAccesses.set(id, projetos);

    const projetoAccess = projetos.find(p => p.projetoId === projeto.id);

    if (projetoAccess) {

      if (permissao) {
        try {
          const userp = this.niveisUsuarios[projetoAccess.catalogUserPermissao.valor];
          return (userp & permissao) === permissao;
        } catch (error) {

          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  async currentUserCanAccess(projeto: Projeto, permissao: any = null) {
    const user = this.currentUser;
    if (user) {
      if (user.role === UserRole.Administrador) {
        return true;
      }
      return await this.userCanAccess(user.id, projeto, permissao);
    } else {
      return false;
    }
  }
}
