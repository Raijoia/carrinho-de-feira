import { createContext, useContext, useEffect, useState } from 'react'
import { usePagamentoContext } from './Pagamento'
import { UsuarioContext } from './Usuario'

export const CarrinhoContext = createContext()
CarrinhoContext.displayName = 'Carrinho'

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([])
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(0)
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0)
  return (
    <CarrinhoContext.Provider 
      value={{ carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos, valorTotalCarrinho, setValorTotalCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinhoContext = () => {
  const { carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos, valorTotalCarrinho, setValorTotalCarrinho } = useContext(CarrinhoContext)
  const {
    formaPagamento
  } = usePagamentoContext()
  const {
    setSaldo
  } = useContext(UsuarioContext)

  function mudarQuantidade(id, quantidade) {
    return carrinho.map(itemDoCarinho => {
      if (itemDoCarinho.id === id) itemDoCarinho.quantidade += quantidade;
      return itemDoCarinho
    })
  }

  function adicionarProduto(novoProduto) {
    // vendo se tem o produto no carrinho
    const temOProduto = carrinho.some(itemDoCarinho => itemDoCarinho.id === novoProduto.id)

    // se não tiver o produto, adiciona e coloca a quantidade como 1
    if (!temOProduto) {
      novoProduto.quantidade = 1
      return setCarrinho(carrinhoAnterior => 
        [...carrinhoAnterior, novoProduto])
    }

    // se ja tiver no carrinho, adiciona uma quantidade
    setCarrinho(mudarQuantidade(novoProduto.id, 1))
  }

  function removerProduto(id) {
    const produto = carrinho.find((itemDoCarrinho) => itemDoCarrinho.id === id)
    const ehOUltimo = produto.quantidade === 1

    // removendo caso estiver apenas 1 item no carrinho
    if(ehOUltimo) {
      return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemDoCarrinho => itemDoCarrinho.id !== id))
    }

    // tirando uma unidade caso tiver mais de uma unidade do produto
    setCarrinho(mudarQuantidade(id, -1))
  }

  function efetuarCompra() {
    setCarrinho([]);
    setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho)
  }

  // use effect, colocando nos [] para escutar o carrihno e o setQuantidadeProdutos
  useEffect(() => {
    // reduz para poder contar a quantidade
    const { novoTotal, novaQuantidade } = carrinho.reduce((contador, produto) => ({
      novaQuantidade: contador.novaQuantidade + produto.quantidade,
      novoTotal: contador.novoTotal + (produto.valor * produto.quantidade)
    }), {
      novaQuantidade: 0,
      novoTotal: 0
    });
    setQuantidadeProdutos(novaQuantidade)
    setValorTotalCarrinho(novoTotal * formaPagamento.juros)
  }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento])

  return {
      carrinho,
      setCarrinho,
      adicionarProduto,
      removerProduto,
      quantidadeProdutos,
      valorTotalCarrinho,
      efetuarCompra
  }
}