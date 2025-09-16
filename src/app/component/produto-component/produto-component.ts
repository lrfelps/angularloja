import { Component, inject, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto-service';
import { ProdutoModel } from '../../models/produtoModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './produto-component.html',
  styleUrl: './produto-component.css'
})
export class ProdutoComponent implements OnInit {

  private service = inject(ProdutoService);

  produtos: ProdutoModel[]=[];
  novoNome = '';
  novoDescricao = '';
  novoPreco = '';
  erro = '';
  ok = '';

  loading = false;

  ngOnInit(){
    this.carregar();
  }

  carregar(){
    this.loading = true;
    this.service.listar()
        //inscreve a reaçao do resultado do observable
        .subscribe({
          next: prod => {
            this.produtos = prod;
            this.loading = false;
          },
          error: e => {
            this.erro = e.messsage;
            this.loading = false;
          }


        })
  }

  adicionar(){
    this.erro = '';
    const precoNum = Number(this.novoPreco);
    if(!this.novoNome.trim()){
      this.erro = 'Informe o Nome!'
      return;
    }
    if(!this.novoDescricao.trim()){
      this.erro = 'Informe a Descrição!'
      return;
    }
    if(Number.isNaN(precoNum) || precoNum < 0){
      this.erro = 'Valor incorreto!'
      return;
    }

    //nomes no payload precisa ser igual ao o que esta na API
    const payload : ProdutoModel={
      id:'',
      nome: this.novoNome ,
      descricao: this.novoDescricao,
      preco: precoNum
    }

    this.loading = true;
    this.service.adicionar(payload).subscribe({
      next: (p) => {
        this.ok = `Produto ${p.nome} salvo com sucesso!`
        this.loading = false;
        this.novoNome = '';
        this.novoDescricao = '';
        this.novoPreco = '';
        this.carregar();
        setTimeout(() => this.ok = '', 3000);
      },
        error: (e) => {
          this.erro = e.messsage || 'Falha ao salvar o produto. ';
          this.loading = false;
        }
    })
  }

  remover(id: string){
    this.service.remover(id).subscribe({
      next: (msg: string) => {
      this.ok = msg || "Produto Apagado.";
      this.carregar();
      setTimeout(() => this.ok = '', 3000);
    },
      error: e=> {
        this.erro = e.messsage || "Deu ruim";
      }
  })
}
}
