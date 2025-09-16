import { Component, inject, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto-service';
import { ProdutoModel } from '../../models/produtoModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './produto-component.html',
  styleUrls: ['./produto-component.css']  // Corrigido para styleUrls (plural)
})
export class ProdutoComponent implements OnInit {

  private service = inject(ProdutoService);

  produtos: ProdutoModel[] = [];
  editaritem: ProdutoModel | null = null;
  novoNome = '';
  novoDescricao = '';
  novoPreco = '';
  erro = '';
  ok = '';

  loading = false;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.service.listar()
      // inscreve a reação do resultado do observable
      .subscribe({
        next: prod => {
          this.produtos = prod;
          this.loading = false;
        },
        error: e => {
          this.erro = e.message || 'Erro ao carregar produtos.';
          this.loading = false;
        }
      });
  }

  adicionar() {
    this.erro = '';
    const precoNum = Number(this.novoPreco);
    if (!this.novoNome.trim()) {
      this.erro = 'Informe o Nome!';
      return;
    }
    if (!this.novoDescricao.trim()) {
      this.erro = 'Informe a Descrição!';
      return;
    }
    if (Number.isNaN(precoNum) || precoNum < 0) {
      this.erro = 'Valor incorreto!';
      return;
    }

    // nomes no payload precisam ser iguais aos da API
    const payload: ProdutoModel = {
      id: '',
      nome: this.novoNome,
      descricao: this.novoDescricao,
      preco: precoNum
    };

    this.loading = true;
    this.service.adicionar(payload).subscribe({
      next: (p) => {
        this.ok = `Produto ${p.nome} salvo com sucesso!`;
        this.loading = false;
        this.novoNome = '';
        this.novoDescricao = '';
        this.novoPreco = '';
        this.carregar();
        setTimeout(() => this.ok = '', 3000);
      },
      error: (e) => {
        this.erro = e.message || 'Falha ao salvar o produto.';
        this.loading = false;
      }
    });
  }

  remover(id: string) {
    this.service.remover(id).subscribe({
      next: (msg: string) => {
        this.ok = msg || "Produto apagado.";
        this.carregar();
        setTimeout(() => this.ok = '', 3000);
      },
      error: e => {
        this.erro = e.message || "Deu ruim";
      }
    });
  }

  salvaredicao() {
    if (!this.editaritem?.id) {
      return;
    }
    this.loading = true;
    this.service.editar(this.editaritem.id, this.editaritem).subscribe({
      next: result => {
        if (result) {
          this.carregar();
          this.ok = 'Produto atualizado com sucesso';
          setTimeout(() => this.ok = '', 3000);
        }
        this.loading = false;
      },
      error: e => {
        this.erro = e.message || "Falha ao atualizar o produto.";
        this.loading = false;
      }
    });
  }
}
