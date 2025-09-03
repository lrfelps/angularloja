import { Component, inject } from '@angular/core';
import { LojaService } from '../../services/loja-service';
import { LojaModel } from '../../models/lojaModel';
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-loja-component',
  imports: [FormsModule],
  templateUrl: './loja-component.html',
  styleUrl: './loja-component.css'
})
export class LojaComponent {

  private service = inject(LojaService);

  lojas: LojaModel[]=[];
  nomeloja = '';
  bairroloja = '';
  cnpjloja = '';
  enderecoloja = '';
  telefoneloja = '';



  ngOnInit(){
    this.carregar();
  }

  carregar(){
    this.lojas = this.service.listar();
  }

  adicionar(){
    const nome= this.nomeloja.trim();
    const bairro = this.bairroloja.trim();
    const cnpj = this.cnpjloja.trim();
    const endereco = this.enderecoloja.trim();
    const telefone = this.telefoneloja.trim();
    if(!nome) return;
    this.service.adicionar(nome, bairro, cnpj, endereco, telefone);
    this.nomeloja ='';
    this.bairroloja = '';
    this.cnpjloja = '';
    this.enderecoloja = '';
    this.telefoneloja = '';
    this.carregar();
  }

    remover(id: number){
      this.service.remover(id);
      this.carregar();
    }

}
