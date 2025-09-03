import { Injectable } from '@angular/core';
import { LojaModel } from '../models/lojaModel';

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private lojas: LojaModel[] = [
  ];
  private nextId = 1;

  listar(): LojaModel[]{
    return [...this.lojas]
  }

  adicionar(nome: string, bairro: string, cnpj: string, endereco: string, telefone: string): LojaModel{
    const novo: LojaModel = {id: this.nextId++,
                                      nome,
                                      bairro,
                                      cnpj,
                                      endereco,
                                      telefone};
    this.lojas.push(novo);
    return novo;
  }

  remover(id: number): void{
    this.lojas = this.lojas.filter(p => p.id !== id);
  }
}
