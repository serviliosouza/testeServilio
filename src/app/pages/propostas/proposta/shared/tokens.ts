import {InjectionToken} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Proposta} from '@app/commons';

export const CAPTACAO_ID = new InjectionToken<BehaviorSubject<number>>('Captação Id');
export const PROPOSTA = new InjectionToken<BehaviorSubject<Proposta>>('Proposta Atual');
export const PROPOSTA_CAN_EDIT = new InjectionToken<BehaviorSubject<boolean>>('Proposta pode ser alterada');
export const PROPOSTA_LABELS = new InjectionToken<Map<string, string>>('Textos usados na Proposta');


